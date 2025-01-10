import { React, useState } from "react";
import Select from "react-select";
import "./styles.css";

export default function App() {
  const limit = 4;
  const [colors, setColors] = useState(["green", "purple", "orange"]);
  const [reset, setReset] = useState();
  const [feedback, setFeedback] = useState("Pick a card!");
  const [cards, setCards] = useState(getPermutations(colors, colors.length));
  // Winner
  const [win, setWin] = useState(pickWinner(colors));

  return (
    <>
      <GamePlay
        setFeedback={setFeedback}
        win={win}
        setReset={setReset}
        feedback={feedback}
        cards={cards}
      />
    </>
  );
}

function pickWinner(colors){
  let winner = [];
  colors.map((color) => {
    winner.push(colors[Math.floor(Math.random() * colors.length)]);
  });
  return winner;
}

function GamePlay({ feedback, setFeedback, cards, win, setReset }) {
  return (
    <>
      <Header win={win} cards={cards} feedback={feedback} />
      <Board
        cards={cards}
        win={win}
        setReset={setReset}
        setFeedback={setFeedback}
        feedback={feedback}
      />
    </>
  );
}

function Header({ win, cards, feedback }) {
  return (
    <>
      <div className="header">
        <Card key={win.flat().toString()} colors={win} />
        <br />
        {feedback}
      </div>
    </>
  );
}

function Board({ cards, win, setFeedback, setReset, feedback }) {
  function findWinner(e) {
    let errs = Array(
      "Try again!",
      "Not a match",
      "Nope",
      "Keep trying",
      "Almost there!",
      "Not quite!",
      "Not this time"
    );
    let code = e.currentTarget.getAttribute("code");
    if (win.toString() === code) {
      setFeedback("You win!");
      setReset(false);
    } else {
      setFeedback(`${errs[Math.floor(Math.random() * errs.length)]}`);
    }
  }

  return (
    <>
      <div className="board">
        {cards.map((combo, i) => {
          return (
            <Card
              key={combo.flat().toString()}
              colors={combo}
              findWinner={findWinner}
            />
          );
        })}
      </div>
    </>
  );
}

function Card({ colors, findWinner }) {
  const [shadow, setShadow] = useState(false);
  const [press, setPress] = useState(false);
  let style = {};
  style.boxShadow = shadow ? "5px 5px 5px #000" : "none";
  style.borderColor = press ? "#BBB" : "inherit";

  return (
    <div
      className="card"
      style={style}
      onClick={findWinner}
      code={colors.flat().toString()}
    >
      {colors.map((color, i) => {
        return (
          <div
            key={color + i}
            style={{ backgroundColor: color }}
            className={`color bg-${color}`}
            onMouseEnter={() => setShadow(true)}
            onMouseLeave={() => setShadow(false)}
            onMouseDown={() => setPress(true)}
            onMouseUp={() => setPress(false)}
          ></div>
        );
      })}
    </div>
  );
}

function SelectColorsForm(limit, colors, setColors, setReset) {
  let colorOptions = [
    ["red", "blue", "yellow"],
    ["green", "purple", "orange"],
    ["pink", "black", "white"],
  ];
  let options = [];
  colorOptions.map((set, key) => {
    set.map((color, k) => {
      options[key] += `<span style="background-color:${color}">${color}</span>`;
    });
  });

  function handleSubmit(formData) {
    console.log(formData.getAll("colors"));
    setColors(formData.getAll("colors"));
    setReset(true);
  }

  return (
    <>
      {options.map((set, i) => {
        return set;
      })}
      <button type="submit" onSubmit={handleSubmit}>
        Submit
      </button>
      {feedback}
    </>
  );
}

/**
 * Stackoverflow FTW https://stackoverflow.com/a/23306461/2208318
 * @param {Array} list
 * @param {Integer} maxLen
 * @returns
 */
function getPermutations(list, maxLen) {
  // Copy initial values as arrays
  var perm = list.map(function (val) {
    return [val];
  });
  // Our permutation generator
  var generate = function (perm, maxLen, currLen) {
    // Reached desired length
    if (currLen === maxLen) {
      return perm;
    }
    // For each existing permutation
    for (var i = 0, len = perm.length; i < len; i++) {
      var currPerm = perm.shift();
      // Create new permutation
      for (var k = 0; k < list.length; k++) {
        perm.push(currPerm.concat(list[k]));
      }
    }
    // Recurse
    return generate(perm, maxLen, currLen + 1);
  };
  // Start with size 1 because of initial values
  return generate(perm, maxLen, 1);
}
