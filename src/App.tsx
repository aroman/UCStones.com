import { reverse, cloneDeep, includes } from "lodash";
import * as React from "react";
import "./App.css";

import HandIcon from "./images/icons/hand.svg";
import MegaphoneIcon from "./images/icons/megaphone.svg";
import CampusIcon from "./images/icons/campus.svg";
import UpgradeIcon from "./images/icons/upgrade.svg";
import MysteryIcon from "./images/icons/mystery.svg";

import {
  tools,
  protesters,
  publicFigures,
  campuses,
  Protester
} from "./GameMechanics";

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
  doneText?: string;
  isDisabled?: boolean;
  onAction: () => void;
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
        {props.doneText ? (
          <div className="SectionCard-button ButtonDisabled">
            {props.doneText}
          </div>
        ) : (
          <div
            className={`SectionCard-button ${
              props.isDisabled ? "ButtonDisabled" : ""
            }`}
            onClick={props.isDisabled ? void 0 : props.onAction}
          >
            <strong>{props.verb}</strong> (costs {numberWithCommas(props.cost)})
          </div>
        )}
      </div>
    </div>
  );
};

const SectionMysteryCard = (props: {}) => {
  return (
    <div className="SectionCard SectionMysteryCard">
      <img className="SectionCard-picture" src={MysteryIcon} />
      <div className="SectionCard-info">
        <div className="SectionCard-name">???</div>
        <div className="SectionCard-description">???</div>
        {/* <div className="SectionCard-button">
          <strong>{props.verb}</strong> (costs {props.cost})
        </div> */}
      </div>
    </div>
  );
};

interface AppState {
  stonesFreed: number;
  toolLevel: number;
  publicFigures: number[];
  protesters: { level: number; count: number }[];
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.onStoneTapped = this.onStoneTapped.bind(this);
    this.onStoneClicked = this.onStoneClicked.bind(this);

    this.upgradeTool = this.upgradeTool.bind(this);
    this.resetState = this.resetState.bind(this);

    const locallySavedState = this.getLocallySavedState();
    if (locallySavedState) {
      this.state = locallySavedState;
    } else {
      this.state = this.getInitialState();
    }
  }

  public hackToPreventDoubleTapZoom() {
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
  }

  public componentDidMount() {
    this.hackToPreventDoubleTapZoom();
    window.onbeforeunload = this.saveStateToLocalStorage.bind(this);
    setInterval(this.saveStateToLocalStorage.bind(this), 1000);
    const millis = 100;
    setInterval(
      () => (this.points += this.pointsPerSecond * millis / 1000),
      millis
    );
  }

  public getInitialState(): AppState {
    return {
      stonesFreed: 0,
      toolLevel: 0,
      publicFigures: [],
      protesters: protesters.map(({ level }) => ({ level, count: 0 }))
    };
  }

  public getLocallySavedState(): AppState | null {
    const locallySavedState = localStorage.getItem("state");
    if (locallySavedState) {
      return JSON.parse(locallySavedState) as AppState;
    }
    return null;
  }

  public saveStateToLocalStorage(): void {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  get pointsPerSecond(): number {
    const protesterPoints = this.state.protesters
      .map(p => {
        const protester = protesters.find(({ level }) => level === p.level);
        if (!protester) {
          this.resetState();
          throw new Error("invalid save data! resetting");
        } else {
          return protester.rate * p.count;
        }
      })
      .reduce((n, sum) => n + sum);
    return protesterPoints;
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
      this.pointsPerClick
    );
  }

  public onStoneClicked(event: React.MouseEvent<HTMLDivElement>) {
    this.onFree();
    this.pointBubbleAt(event.clientX, event.clientY, this.pointsPerClick);
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

  set points(points: number) {
    this.setState({ stonesFreed: points });
  }

  get currentTool() {
    return tools[this.state.toolLevel];
  }

  public resetState() {
    if (confirm("really reset all progress?")) {
      this.setState(this.getInitialState());
    }
  }

  get pointsPerClick() {
    return this.currentTool.rate;
  }

  get availableProtesters(): Protester[] {
    // const unaffordableProtesters = protesters.filter(p => p.cost > this.points);
    // const highestProtesterLevelAvailable =
    //   unaffordableProtesters.length > 0
    //     ? protesters.indexOf(unaffordableProtesters[0])
    //     : protesters.length;
    // console.log(highestProtesterLevelAvailable);
    return protesters.slice(0, this.currentTool.level);
  }

  public protestersOfLevel(level: number) {
    const stat = this.state.protesters.find(p => p.level === level);
    if (!stat) {
      return 0;
    }
    return stat.count;
  }

  get toolIsUpgradable() {
    return (
      this.points >= this.currentTool.cost &&
      this.state.toolLevel < tools.length - 1
    );
  }

  get activePublicFigures() {
    return this.state.publicFigures.map(level => {
      const publicFigure = publicFigures.find(p => p.level === level);
      if (!publicFigure) {
        this.resetState();
        throw new Error("invalid save data! resetting");
      } else {
        return publicFigure;
      }
    });
  }

  public adjustedProtesterCost(protster: Protester) {
    const publicFigureScaling = this.activePublicFigures.reduce(
      (total, publicFigure) => total * 1 - publicFigure.percent / 100,
      1
    );
    return (
      protster.cost *
      this.protestersOfLevel(protster.level) *
      publicFigureScaling
    );
  }

  public addPublicFigure(level: number) {
    const publicFigures = cloneDeep(this.state.publicFigures);
    publicFigures.push(level);
    this.setState({ publicFigures });
  }

  public addProtester(protester: Protester) {
    const cost = this.adjustedProtesterCost(protester);
    if (cost > this.points) {
      return;
    }
    const protesters = cloneDeep(this.state.protesters).map(p => {
      if (protester.level === p.level) {
        return {
          ...p,
          level: p.level,
          count: p.count + 1
        };
      }
      return p;
    });

    this.points -= cost;
    this.setState({ protesters });
  }

  public upgradeTool() {
    if (!this.toolIsUpgradable) {
      return;
    }
    this.setState({
      toolLevel: this.state.toolLevel + 1
    });
  }

  public onFree() {
    this.points += this.pointsPerClick;
  }

  public render() {
    const showProtesters = this.currentTool.level >= 2;
    const showPublicFigures = this.currentTool.level >= 4;
    const showCampuses = this.currentTool.level >= 6;
    return (
      <div className="App">
        <div className="TopBanner" onClick={this.resetState}>
          <div className="TopBanner-title">
            Stones freed: {numberWithCommas(Math.round(this.state.stonesFreed))}
          </div>
          <div className="TopBanner-subtitle">
            {this.pointsPerSecond} per second
          </div>
        </div>
        <div className="MainStage">
          <div
            className={`Stone Cursor-${this.state.toolLevel}`}
            onClick={this.onStoneClicked}
            style={{ cursor: `url(${this.currentTool.cursor}) 0 0, auto` }}
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
          {showProtesters ? (
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
                {this.availableProtesters
                  .reverse()
                  .map(protester => (
                    <SectionCard
                      count={this.protestersOfLevel(protester.level)}
                      name={protester.name}
                      description={`Frees ${numberWithCommas(
                        protester.rate
                      )} stones/sec`}
                      cost={this.adjustedProtesterCost(protester)}
                      verb={"HIRE"}
                      isDisabled={
                        this.adjustedProtesterCost(protester) > this.points
                      }
                      onAction={() => this.addProtester(protester)}
                      image={protester.image}
                    />
                  ))}
              </div>
            </div>
          ) : null}

          {showPublicFigures ? (
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
                {reverse(publicFigures.slice()).map(
                  (publicFigure, level) =>
                    this.points > publicFigure.cost ? (
                      <SectionCard
                        name={publicFigure.name}
                        description={`Protesters cost ${
                          publicFigure.percent
                        }% less`}
                        cost={publicFigure.cost}
                        verb={"CONVINCE"}
                        image={publicFigure.image}
                        isDisabled={publicFigure.cost > this.points}
                        onAction={() => this.addPublicFigure(level)}
                        doneText={
                          includes(this.state.publicFigures, level)
                            ? "CONVINCED!"
                            : undefined
                        }
                      />
                    ) : (
                      <SectionMysteryCard />
                    )
                )}
              </div>
            </div>
          ) : null}

          {showCampuses ? (
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
                {reverse(campuses.slice()).map(campus => (
                  <SectionCard
                    name={campus.name}
                    description={campus.description}
                    cost={campus.cost}
                    verb={"EXPAND"}
                    image={campus.image}
                    onAction={() => this.addPublicFigure(0)}
                    doneText={"EXPANDED!"}
                  />
                ))}
              </div>
            </div>
          ) : null}
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
