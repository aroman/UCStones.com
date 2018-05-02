import * as _ from "lodash";
import * as React from "react";
import "./App.css";

import Logo from "./logo.png";
import Plus from "./plus.svg";
import Trophy from "./trophy.svg";
import Upgrade from "./upgrade.svg";

enum StoneStatus {
  Free,
  Jailed,
  Missing
}

const GARDEN_SIZE = 5;
const NUM_STONES = GARDEN_SIZE * 2 + (GARDEN_SIZE - 2) * GARDEN_SIZE;
const garden = _.times(NUM_STONES).map(i => {
  const R = Math.random();
  if (R > 0.66) {
    return StoneStatus.Free;
  }
  if (R > 0.33) {
    return StoneStatus.Jailed;
  }
  return StoneStatus.Missing;
});

const Stone = (props: { status: StoneStatus }) => {
  if (props.status === StoneStatus.Free) {
    return <div className="Stone StoneFree" />;
  } else if (props.status === StoneStatus.Jailed) {
    return <div className="Stone StoneJailed" />;
  } else {
    return <div className="Stone" />;
  }
};

interface PanelProps {
  title: string;
  rate: number;
  unit: string;
  label: string;
  quantity: number;
  cost: number;
  buttonColor: string;
  canUpgrade: boolean;
}

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

const GamePanel = (props: PanelProps) => {
  return (
    <div className="GamePanel">
      <div className="GamePanel-header">
        <div className="GamePanel-header-title">{props.title}:</div>
        <div className="GamePanel-header-stats">
          {props.rate} {props.unit}
        </div>
      </div>
      <div className="GamePanel-inner">
        <div
          className="GamePanel-button"
          style={{ backgroundColor: props.buttonColor }}
        >
          <div className="GamePanel-button-inner">
            <img className="GamePanel-button-icon" src={Plus} />
            <div className="GamePanel-button-label">
              {props.label} ({props.quantity})
            </div>
          </div>
          <div className="GamePanel-button-subtitle">
            Cost: {props.cost} stones
          </div>
        </div>

        {props.canUpgrade ? (
          <div
            className="GamePanel-button"
            style={{ backgroundColor: "black" }}
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

class App extends React.Component {
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
              <div>2. Buy upgrades</div>
              <div>3. FREE ALL THE STONES!!!</div>
            </div>
          </div>
        </div>

        <div className="Game">
          <div className="GameScore">
            Stones freed:<div className="GameScore-value">341,344</div>
          </div>

          <GamePanel
            title="Liberators"
            unit="stones/sec"
            rate={132}
            quantity={43}
            cost={100}
            label="112 TA"
            buttonColor="#d8720f"
            canUpgrade={true}
          />
          <GamePanel
            title="Tools"
            unit="stones/tap"
            rate={132}
            quantity={43}
            cost={100}
            label="David Tepper"
            buttonColor="#8D19C6"
            canUpgrade={false}
          />

          <div className="Garden">
            <div className="Garden-logo">UC Stones.com</div>
            {_.times(GARDEN_SIZE).map(i => (
              <div className="Garden-row">
                {_.times(i % (GARDEN_SIZE - 1) === 0 ? GARDEN_SIZE : 2).map(
                  j => <Stone key={`${i}-${j}}`} status={garden[i * j]} />
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
