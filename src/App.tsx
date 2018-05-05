import { cloneDeep, includes } from "lodash";
import * as React from "react";
import "./App.css";

import HandIcon from "./images/icons/hand.svg";
import MegaphoneIcon from "./images/icons/megaphone.svg";
import CampusIcon from "./images/icons/campus.svg";
// import UpgradeIcon from "./images/icons/upgrade.svg";
// import MysteryIcon from "./images/icons/mystery.svg";

import {
  tools,
  protesters,
  nextProtesterCost,
  publicFigures,
  campuses,
  Tool,
  Protester,
  PublicFigure,
  Campus
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
          <div className="">{props.doneText}</div>
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

// const SectionMysteryCard = (props: {}) => {
//   return (
//     <div className="SectionCard SectionMysteryCard">
//       <img className="SectionCard-picture" src={MysteryIcon} />
//       <div className="SectionCard-info">
//         <div className="SectionCard-name">???</div>
//         <div className="SectionCard-description">???</div>
//         {/* <div className="SectionCard-button">
//           <strong>{props.verb}</strong> (costs {props.cost})
//         </div> */}
//       </div>
//     </div>
//   );
// };

interface AppState {
  points: number;
  totalStonesFreed: number;
  toolLevel: number;
  publicFigures: number[];
  campuses: number[];
  protesters: { level: number; count: number }[];
}

class App extends React.Component<{}, AppState> {
  lastFreedTime = 0;
  cheatingCount = 0;
  bannerPointsRef: HTMLElement | null;

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
    setInterval(this.clearBannerPointsTint.bind(this), 250);
  }

  public getInitialState(): AppState {
    return {
      points: 0,
      totalStonesFreed: 0,
      toolLevel: 0,
      publicFigures: [],
      campuses: [],
      protesters: protesters.map(({ level }) => ({ level, count: 0 }))
    };
  }

  public getLocallySavedState(): AppState | null {
    const locallySavedState = localStorage.getItem("app-state");
    if (locallySavedState) {
      return JSON.parse(locallySavedState) as AppState;
    }
    return null;
  }

  public saveStateToLocalStorage(): void {
    localStorage.setItem("app-state", JSON.stringify(this.state));
  }

  get pointsPerSecond(): number {
    const protesterPoints = this.state.protesters
      .map(p => {
        const protester = protesters.find(({ level }) => level === p.level);
        if (!protester) {
          this.resetState();
          throw new Error("invalid save data! resetting");
        } else {
          return this.adjustedProtesterRate(protester) * p.count;
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
      event.touches[0].pageX,
      event.touches[0].pageY,
      this.pointsPerClick
    );
  }

  public onStoneClicked(event: React.MouseEvent<HTMLDivElement>) {
    this.onFree();
    this.pointBubbleAt(event.pageX, event.pageY, this.pointsPerClick);
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
    return this.state.points;
  }

  set points(points: number) {
    const delta = points - this.state.points;
    let totalStonesFreed = this.state.totalStonesFreed;
    if (delta > 0) {
      totalStonesFreed += delta;
    }
    this.setState({
      points,
      totalStonesFreed
    });
  }

  get currentTool(): Tool {
    return tools[this.state.toolLevel];
  }

  public resetState() {
    // debugger;
    if (confirm("Reset ALL progress? There's no going back!")) {
      this.setState(this.getInitialState());
    }
  }

  get pointsPerClick() {
    const numberOfProtesters = this.state.protesters.reduce(
      (sum, { count }) => sum + count,
      0
    );
    const CMUQatarMultiplier =
      this.state.campuses.indexOf(1) === -1 ? 1 : numberOfProtesters / 25;
    const SubroniumMultiplier = this.state.campuses.indexOf(3) === -1 ? 1 : 10;
    return (
      this.currentTool.rate *
      this.publicFigureScaleFactor(true) *
      CMUQatarMultiplier *
      SubroniumMultiplier
    );
  }

  get availableProtesters(): Protester[] {
    return protesters.slice(0, this.currentTool.level);
  }

  get availablePublicFigures() {
    if (this.currentTool.level < 3) {
      return [];
    }
    return publicFigures.filter(
      publicFigure =>
        this.state.totalStonesFreed >= publicFigure.totalStonesNeeded
    );
  }

  get availableCampuses() {
    if (this.currentTool.level < 5) {
      return [];
    }
    return campuses.filter(
      campus => this.state.totalStonesFreed >= campus.totalStonesNeeded
    );
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
      this.state.totalStonesFreed >= this.currentTool.totalStonesNeeded &&
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

  get toolUpgradePercent() {
    // const prevToolStones =
    //   this.state.toolLevel === 0
    //     ? 0
    //     : tools[this.state.toolLevel - 1].totalStonesNeeded;
    // const prevToolStones = tools.reduce((sum, tool) => {
    //   if (tool.level <= this.currentTool.level) {
    //     return (sum += tool.totalStonesNeeded);
    //   }
    //   return 0;
    // }, 0);
    return Math.round(
      this.state.totalStonesFreed / this.currentTool.totalStonesNeeded * 100
    );
  }

  public publicFigureScaleFactor(clickUpgrade: boolean) {
    const matchingFigures = this.activePublicFigures.filter(
      publicFigure => publicFigure.clickUpgrade === clickUpgrade
    );
    if (matchingFigures.length === 0) {
      return 1;
    }
    return matchingFigures[matchingFigures.length - 1].percent;
  }

  public adjustedProtesterRate(protester: Protester) {
    const CMUSiliconValleyMultiplier =
      this.state.campuses.indexOf(0) !== -1 ? 2 : 1;
    const CentralMichiganMultiplier =
      this.state.campuses.indexOf(2) !== -1 ? 4 : 1;
    return (
      protester.rate * CMUSiliconValleyMultiplier * CentralMichiganMultiplier
    );
  }

  public adjustedProtesterCost(protster: Protester) {
    return (
      nextProtesterCost(protster, this.protestersOfLevel(protster.level)) *
      (this.protestersOfLevel(protster.level) + 1) *
      this.publicFigureScaleFactor(false)
    );
  }

  public addPublicFigure(publicFigure: PublicFigure) {
    const publicFigures = cloneDeep(this.state.publicFigures);
    publicFigures.push(publicFigure.level);
    this.points -= publicFigure.cost;
    this.setState({ publicFigures });
  }

  public addCampus(campus: Campus) {
    const campuses = cloneDeep(this.state.campuses);
    campuses.push(campus.level);
    this.points -= campus.cost;
    this.setState({ campuses });
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

  public clearBannerPointsTint() {
    const timeDelta = Date.now() - this.lastFreedTime;
    console.log(this.lastFreedTime);
    if (timeDelta > 250) {
      if (this.bannerPointsRef) {
        this.bannerPointsRef.style.color = "unset";
      }
    }
  }

  public tintBannerPoints() {
    if (this.bannerPointsRef) {
      this.bannerPointsRef.style.color = "#26e81d";
    }
  }

  public onFree() {
    const cheaterDelta = 35; // milliseconds
    const timeDelta = Date.now() - this.lastFreedTime;
    if (timeDelta <= cheaterDelta) {
      this.cheatingCount += 1;
      if (this.cheatingCount > 10) {
        window.location.href = "/cheating.html";
      }
      return;
    }
    this.points += this.pointsPerClick;
    this.lastFreedTime = Date.now();
    this.tintBannerPoints();
  }

  public render() {
    return (
      <div className="App">
        <div className="App-Inner">
          <div className="TopBanner">
            <div className="TopBanner-title">
              Free stones:
              <strong
                ref={bannerPointsRef =>
                  (this.bannerPointsRef = bannerPointsRef)
                }
              >
                {numberWithCommas(Math.round(this.points))}
              </strong>
            </div>
            <div className="TopBanner-subtitle">
              {numberWithCommas(this.pointsPerSecond)} per second
            </div>
          </div>
          <div className="MainStage">
            <div
              className="Stone"
              onClick={this.onStoneClicked}
              style={{ cursor: `url(${this.currentTool.cursor}) 0 0, pointer` }}
              onTouchEnd={this.onStoneTapped}
            />
            <div className="ToolBoxContainer">
              <div className="ToolBox">
                <div className="ToolBox-name">{this.currentTool.name}</div>
                <div className="ToolBox-description">
                  {this.currentTool.description}
                </div>
                <img className="ToolBox-image" src={this.currentTool.image} />
              </div>
              {this.toolIsUpgradable ? (
                <div className="ToolBox-upgrade" onClick={this.upgradeTool}>
                  <div className="ToolBox-upgrade-label">UPGRADE</div>
                </div>
              ) : (
                <div
                  className="ToolBox-upgrade UpgradeProgress"
                  onClick={this.upgradeTool}
                >
                  <div className="ToolBox-upgrade-label">
                    {this.toolUpgradePercent}%
                  </div>
                  <div
                    className="ToolBox-upgrade-bar"
                    style={{ width: `${this.toolUpgradePercent}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="Sections"
            style={{
              display: this.availableProtesters.length > 0 ? "unset" : "none"
            }}
          >
            {this.availableProtesters.length > 0 ? (
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

            {this.availablePublicFigures.length > 0 ? (
              <div className="Section SectionPublicFigures">
                <div className="SectionBanner">
                  <img className="SectionBanner-icon" src={MegaphoneIcon} />
                  <div className="SectionBanner-label">
                    <div className="SectionBanner-name">Public Figures</div>
                    <div className="SectionBanner-description">
                      Use their influence to help free stones
                    </div>
                  </div>
                </div>
                <div className="SectionGutter">
                  {this.availablePublicFigures
                    .reverse()
                    .map(publicFigure => (
                      <SectionCard
                        name={publicFigure.name}
                        description={publicFigure.description}
                        cost={publicFigure.cost}
                        verb={"CONVINCE"}
                        image={publicFigure.image}
                        isDisabled={publicFigure.cost > this.points}
                        onAction={() => this.addPublicFigure(publicFigure)}
                        doneText={
                          includes(this.state.publicFigures, publicFigure.level)
                            ? "CONVINCED!"
                            : undefined
                        }
                      />
                    ))}
                </div>
              </div>
            ) : null}

            {this.availableCampuses.length > 0 ? (
              <div className="Section SectionCampuses">
                <div className="SectionBanner">
                  <img className="SectionBanner-icon" src={CampusIcon} />
                  <div className="SectionBanner-label">
                    <div className="SectionBanner-name">Campuses</div>
                    <div className="SectionBanner-description">
                      Enlist other students around the world
                    </div>
                  </div>
                </div>
                <div className="SectionGutter">
                  {this.availableCampuses
                    .reverse()
                    .map(campus => (
                      <SectionCard
                        name={campus.name}
                        description={campus.description}
                        cost={campus.cost}
                        verb={"EXPAND"}
                        image={campus.image}
                        onAction={() => this.addCampus(campus)}
                        isDisabled={campus.cost > this.points}
                        doneText={
                          includes(this.state.campuses, campus.level)
                            ? "EXPANDED!"
                            : undefined
                        }
                      />
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="Footer">
          <div onClick={this.resetState} className="Reset">
            reset?
          </div>
          <div>
            made with <b onClick={() => (this.points *= 2)}>&hearts;</b>{" "}
            by&nbsp;<a href="https://avi.bio" target="_blank">
              Avi
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
