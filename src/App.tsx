import * as _ from "lodash";
import * as React from "react";
import "./App.css";

import {
  toolRate,
  toolCost,
  liberatorCost,
  liberatorRate,
  toolNames,
  liberatorNames
} from "./GameMechanics";

import Logo from "./logo.png";
import Plus from "./plus.svg";
import Trophy from "./trophy.svg";
import Upgrade from "./upgrade.svg";

enum StoneStatus {
  Free,
  Jailed,
  Missing
}

const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const GARDEN_SIZE = 5;
const NUM_STONES = GARDEN_SIZE * 2 + (GARDEN_SIZE - 2) * GARDEN_SIZE;
const garden = _.times(NUM_STONES).map(i => {
  // const R = Math.random();
  return StoneStatus.Jailed;
  // if (R > 0.66) {
  //   return StoneStatus.Free;
  // }
  // if (R > 0.33) {
  // }
  // return StoneStatus.Missing;
});

const Stone = (props: { status: StoneStatus; onFree: () => void }) => {
  if (props.status === StoneStatus.Free) {
    return <div className="Stone StoneFree" />;
  } else if (props.status === StoneStatus.Jailed) {
    return <div className="Stone StoneJailed" onClick={props.onFree} />;
  } else {
    return <div className="Stone" />;
  }
};

const topScorers = [
  {
    name: "SUBRA",
    score: 5492
  },
  {
    name: "Delt is OK",
    score: 4452
  },
  {
    name: "sn3k4lyf",
    score: 4330
  },
  {
    name: "Andy Borans",
    score: 3004
  },
  {
    name: "112TA",
    score: 2493
  }
];

interface PanelProps {
  title: string;
  rate: number;
  unit: string;
  label: string;
  quantity: number;
  cost: number;
  buttonColor: string;
  canUpgrade: boolean;
  canBuy: boolean;
  onBuy: () => void;
  onUpgrade: () => void;
}

const GamePanel = (props: PanelProps) => {
  return (
    <div className="GamePanel">
      <div className="GamePanel-header">
        <div className="GamePanel-header-title">{props.title}</div>
        <div className="GamePanel-header-stats">
          {numberWithCommas(props.rate)} {props.unit}
        </div>
      </div>
      <div className="GamePanel-inner">
        <div
          className={`GamePanel-button ${
            props.canBuy ? "" : "GamePanel-button-disabled"
          }`}
          style={{ backgroundColor: props.buttonColor }}
        >
          <div
            className="GamePanel-button-inner"
            onClick={props.canBuy ? props.onBuy : void 0}
          >
            <img className="GamePanel-button-icon" src={Plus} />
            <div className="GamePanel-button-label">
              {props.label} ({numberWithCommas(props.quantity)})
            </div>
          </div>
          <div className="GamePanel-button-subtitle">
            Cost: {numberWithCommas(props.cost)} stones
          </div>
        </div>

        {props.canUpgrade ? (
          <div
            className="GamePanel-button"
            style={{ backgroundColor: "black" }}
            onClick={props.onUpgrade}
          >
            <div className="GamePanel-button-inner noNudge">
              <img className="GamePanel-button-icon" src={Upgrade} />
              <div className="GamePanel-button-label">UPGRADE</div>
            </div>
          </div>
        ) : null}
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
    this.state = {
      stonesFreed: 0,
      toolCount: 1,
      toolLevel: 0,
      liberatorLevel: 0,
      liberatorCount: 0
    };
    this.onFree = this.onFree.bind(this);
    this.buyTool = this.buyTool.bind(this);
    this.buyLiberator = this.buyLiberator.bind(this);
    this.upgradeLiberator = this.upgradeLiberator.bind(this);
    this.upgradeTool = this.upgradeTool.bind(this);
    setInterval(this.onLiberate.bind(this), 100);
  }

  get toolCost() {
    return toolCost(this.state.toolLevel);
  }

  get liberatorCost() {
    return liberatorCost(this.state.liberatorLevel);
  }

  get liberatorRate() {
    return liberatorRate(this.state.liberatorLevel);
  }

  get toolRate() {
    return toolRate(this.state.toolLevel);
  }

  public onLiberate() {
    const amount = this.liberatorRate * this.state.liberatorCount;
    this.setState({
      stonesFreed: this.state.stonesFreed + amount / 10
    });
  }

  public upgradeTool() {
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
    this.setState({
      stonesFreed: this.state.stonesFreed + this.state.toolCount * this.toolRate
    });
  }

  public buyTool() {
    this.setState({
      stonesFreed: this.state.stonesFreed - this.toolCost,
      toolCount: this.state.toolCount + 1
    });
  }

  public buyLiberator() {
    this.setState({
      stonesFreed: this.state.stonesFreed - this.liberatorCost,
      liberatorCount: this.state.liberatorCount + 1
    });
  }

  public render() {
    return (
      <div className="App">
        <div className="Banner">
          <div className="BannerCard">
            <div className="BannerCard-title">
              <div>UCStones.com</div>
              <img src={Logo} />
            </div>
            <div className="BannerCard-instructions">
              <div>1. Tap a UC Stone to free it</div>
              <div>2. Buy tools and hire liberators</div>
              <div>3. FREE ALL THE STONES!!!</div>
            </div>
          </div>
        </div>

        <div className="Game">
          <div className="GameScore">
            Stones freed:<div className="GameScore-value">
              {numberWithCommas(Math.round(this.state.stonesFreed))}
            </div>
          </div>

          <div className="GamePanels">
            <GamePanel
              title="Tools"
              unit="stones/tap"
              rate={this.toolRate}
              canBuy={this.state.stonesFreed >= this.toolCost}
              quantity={this.state.toolCount}
              cost={this.toolCost}
              label={toolNames[this.state.toolLevel]}
              buttonColor="#8D19C6"
              onBuy={this.buyTool}
              canUpgrade={
                this.state.stonesFreed >= toolCost(this.state.toolLevel + 1)
              }
              onUpgrade={this.upgradeTool}
            />

            <GamePanel
              title="Liberators"
              unit="stones/sec"
              rate={this.liberatorRate * this.state.liberatorCount}
              canBuy={this.state.stonesFreed >= this.liberatorCost}
              quantity={this.state.liberatorCount}
              cost={this.liberatorCost}
              label={liberatorNames[this.state.liberatorLevel]}
              buttonColor="#d8720f"
              onBuy={this.buyLiberator}
              canUpgrade={
                this.state.stonesFreed >=
                liberatorCost(this.state.liberatorLevel + 1)
              }
              onUpgrade={this.upgradeLiberator}
            />
          </div>

          <div className="Garden">
            {/* <div className="Garden-logo">UC Stones.com</div> */}
            {_.times(GARDEN_SIZE).map(i => (
              <div className="Garden-row">
                {_.times(i % (GARDEN_SIZE - 1) === 0 ? GARDEN_SIZE : 2).map(
                  j => (
                    <Stone
                      onFree={this.onFree}
                      key={`${i}-${j}}`}
                      status={garden[i * j]}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="Leaderboard">
          <div className="LeaderboardCard">
            <div className="LeaderboardCard-title">
              <img src={Trophy} />
              <div>Most Stones Freed</div>
            </div>
            <div className="LeaderboardCard-list">
              {topScorers.map(({ name, score }, i) => (
                <div>
                  {i + 1}. {name} ({score} stones)
                </div>
              ))}
              <div className="Leaderboard-ScoreDivider">...</div>
              <div>
                {344}. Yikes! ({590} stones)
              </div>
              <div className="Leaderboard-You">
                {345}. Jaimeeee ({579} stones)
              </div>
              <div>
                {346}. 01101001 ({577} stones)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
