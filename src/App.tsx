// import * as _ from "lodash";
import * as React from "react";
import "./App.css";

import HandIcon from "./icons/hand.svg";
import MegaphoneIcon from "./icons/megaphone.svg";
import CampusIcon from "./icons/campus.svg";
import UpgradeIcon from "./icons/upgrade.svg";

import { tools, protesters, publicFigures, campuses } from "./GameMechanics";

const numberWithCommas = (x: number) => {
  return Math.round(x)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface SectionProps {
  count?: number;
  name: string;
  description: string;
  cost: number;
  verb: string;
  image?: string;
}

const SectionCard = (props: SectionProps) => {
  return (
    <div className="SectionCard">
      <img className="SectionCard-picture" src={props.image} />
      <div className="SectionCard-info">
        {props.count === undefined ? null : (
          <div className="SectionCard-count">x {props.count}</div>
        )}
        <div className="SectionCard-name">{props.name}</div>
        <div className="SectionCard-description">{props.description}</div>
        <div className="SectionCard-button">
          <strong>{props.verb}</strong> (costs {props.cost})
        </div>
      </div>
    </div>
  );
};

interface AppState {
  stonesFreed: number;
  liberatorCount: number;
  liberatorLevel: number;
  toolCount: number;
  toolLevel: number;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.onStoneTapped = this.onStoneTapped.bind(this);
    this.onStoneClicked = this.onStoneClicked.bind(this);

    this.upgradeLiberator = this.upgradeLiberator.bind(this);
    this.upgradeTool = this.upgradeTool.bind(this);
    this.resetState = this.resetState.bind(this);

    setInterval(this.saveStateToLocalStorage.bind(this), 1000);

    const locallySavedState = this.getLocallySavedState();
    if (locallySavedState) {
      this.state = locallySavedState;
    } else {
      this.state = this.getInitialState();
    }
  }

  public componentDidMount() {
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      event => {
        const isTapOnStone =
          event.target && (event.target as any).classList.contains("Stone");
        if (isTapOnStone) {
          return;
        }
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 600) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );
    // (window.document.querySelector(
    //   ".Stone"
    // )! as HTMLElement).onclick = this.onStoneTapped.bind(this);
    window.onbeforeunload = this.saveStateToLocalStorage.bind(this);
  }

  public getInitialState(): AppState {
    return {
      stonesFreed: 0,
      toolCount: 1,
      toolLevel: 0,
      liberatorLevel: 0,
      liberatorCount: 0
    };
  }

  public getLocallySavedState(): AppState | null {
    const locallySavedState = localStorage.getItem("state");
    if (locallySavedState) {
      return JSON.parse(locallySavedState) as AppState;
    }
    return null;
  }

  public saveStateToLocalStorage() {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  public onStoneTapped(event: React.TouchEvent<HTMLDivElement>) {
    console.log(event.touches);
    if (event.touches.length === 0) {
      return;
    }
    this.onFree();
    this.pointBubbleAt(
      event.touches[0].clientX,
      event.touches[0].clientY,
      this.state.toolCount
    );
  }

  public onStoneClicked(event: React.MouseEvent<HTMLDivElement>) {
    this.onFree();
    this.pointBubbleAt(event.clientX, event.clientY, this.state.toolCount);
  }

  public pointBubbleAt(x: number, y: number, value: number) {
    const shard = document.createElement("div");
    shard.classList.add("Shard");
    shard.style.left = `${x}px`;
    shard.style.top = `${y}px`;
    document.body.appendChild(shard);
    shard.innerText = `+${numberWithCommas(value)}`;
    shard.addEventListener("animationend", () => {
      document.body.removeChild(shard);
    });
    return true;
  }

  get points() {
    return this.state.stonesFreed;
  }

  get currentTool() {
    return tools[this.state.toolLevel];
  }

  public resetState() {
    if (confirm("really reset all progress?")) {
      this.setState(this.getInitialState());
    }
  }

  public setStonesFreed(stonesFreed: number) {
    this.setState({ stonesFreed });
  }

  get toolIsUpgradable() {
    return (
      this.points < this.currentTool.upgradePoints &&
      this.state.toolLevel < tools.length - 1
    );
  }

  public upgradeTool() {
    if (!this.toolIsUpgradable) {
      return;
    }
    this.setState({
      toolLevel: this.state.toolLevel + 1,
      toolCount: 1
    });
  }

  public upgradeLiberator() {
    this.setState({
      liberatorLevel: this.state.liberatorLevel + 1,
      liberatorCount: 0
    });
  }

  public onFree() {
    this.setStonesFreed(this.state.stonesFreed);
  }

  // public buyTool() {
  //   this.setState({
  //     stonesFreed: this.state.stonesFreed - this.toolCost,
  //     toolCount: this.state.toolCount + 1
  //   });
  // }

  public render() {
    return (
      <div className="App">
        <div className="TopBanner" onClick={this.resetState}>
          <div className="TopBanner-title">
            Stones freed: {numberWithCommas(Math.round(this.state.stonesFreed))}
          </div>
          <div className="TopBanner-subtitle">45,000 per second</div>
        </div>
        <div className="MainStage">
          <div
            className={`Stone Cursor-${this.state.toolLevel}`}
            onClick={this.onStoneClicked}
            onTouchEnd={this.onStoneTapped}
          />
          <div
            className={`ToolBox ${
              this.toolIsUpgradable ? "ToolBoxUpgradable" : ""
            }`}
            onClick={this.upgradeTool}
          >
            <div className="ToolBox-name">{this.currentTool.name}</div>
            <div className="ToolBox-description">
              {this.currentTool.description}
            </div>
            <img className="ToolBox-image" src={this.currentTool.image} />
            {this.toolIsUpgradable ? (
              <div className="ToolBox-upgrade">
                <img className="ToolBox-upgrade-icon" src={UpgradeIcon} />
                <div className="ToolBox-upgrade-label">UPGRADE</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="Sections">
          <div className="Section SectionProtesters">
            <div className="SectionBanner">
              <img className="SectionBanner-icon" src={HandIcon} />
              <div className="SectionBanner-label">
                <div className="SectionBanner-name">Protesters</div>
                <div className="SectionBanner-description">
                  Set stones free periodically
                </div>
              </div>
            </div>
            <div className="SectionGutter">
              {protesters.map(protester => (
                <SectionCard
                  count={0}
                  name={protester.name}
                  description={protester.description}
                  cost={protester.cost}
                  verb={"HIRE"}
                  image={protester.image}
                />
              ))}
            </div>
          </div>

          <div className="Sections">
            <div className="Section SectionPublicFigures">
              <div className="SectionBanner">
                <img className="SectionBanner-icon" src={MegaphoneIcon} />
                <div className="SectionBanner-label">
                  <div className="SectionBanner-name">Public Figures</div>
                  <div className="SectionBanner-description">
                    Decrease costs with their influence
                  </div>
                </div>
              </div>
              <div className="SectionGutter">
                {publicFigures.map(publicFigure => (
                  <SectionCard
                    name={publicFigure.name}
                    description={publicFigure.description}
                    cost={publicFigure.cost}
                    verb={"CONVINCE"}
                    image={publicFigure.image}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="Sections">
            <div className="Section SectionCampuses">
              <div className="SectionBanner">
                <img className="SectionBanner-icon" src={CampusIcon} />
                <div className="SectionBanner-label">
                  <div className="SectionBanner-name">Campuses</div>
                  <div className="SectionBanner-description">
                    Multiplies stones freed per tap
                  </div>
                </div>
              </div>
              <div className="SectionGutter">
                {campuses.map(campus => (
                  <SectionCard
                    name={campus.name}
                    description={campus.description}
                    cost={campus.cost}
                    verb={"EXPAND"}
                    image={campus.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="Footer">
          made with love by&nbsp;<a href="https://avi.bio" target="_blank">
            Avi
          </a>
        </div>
      </div>
    );
  }
}

export default App;
