import { React, useState, ErrorBoundary } from "react";
import "./styles.css";

export default function App() {
  const limit = 4;
  const colors = ["red", "blue", "green", "yellow"];
  const [tooManyColors, setTooManyColors] = useState(colors.length <= limit);
  const win = [];
  let combos = [];
  // Winner
  colors.map((color) => {
    win.push(colors[Math.floor(Math.random() * colors.length)]);
  });

  // 5 or more is too many for the browser to handle
  if (tooManyColors) {
    combos = getPermutations(colors, colors.length);
  }
  return (
    <>
      <Header
        win={win}
        combos={combos}
        tooManyColors={tooManyColors}
        limit={limit}
      />
    </>
  );
}

function Header({ win, combos, tooManyColors, limit }) {
  const [feedback, setFeedback] = useState(
    tooManyColors
      ? "Find the matching card!"
      : `${win.length} values renders too many colors combinations. Please use ${limit} or less.`
  );
  return (
    <>
      <div className="header">
        <Card key={win.flat().toString()} colors={win} />
        {console.log(`${combos.length} combinations`)}
        <br />
        {feedback}
      </div>
      <Board cards={combos} win={win} setFeedback={setFeedback} />
    </>
  );
}

function Board({ cards, win, setFeedback }) {
  function findWinner(e) {
    let errs = Array("Try again!", "Not a match", "Nope", "Keep trying",'Almost there!','Not quite!','Not this time');
    let code = e.currentTarget.getAttribute("code");
    if (win.toString() === code) {
      setFeedback("You win!");
    } else {
      setFeedback(
        `${errs[Math.floor(Math.random() * errs.length)]}`
      );
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

function* permute(permutation) {
  var length = permutation.length,
    c = Array(length).fill(0),
    i = 1,
    k,
    p;

  yield permutation.slice();
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      //     yield permutation.slice(); // Dupes?
      permutation[k] = p;
      ++c[i];
      i = 1;
      yield permutation.slice();
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

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
