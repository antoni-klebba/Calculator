const { useState, useEffect } = React;

const buttonsData = [
  { id: "clear", value: "AC", display: "AC" },
  { id: "backspace", value: "BS", display: "backspace" },
  { id: "divide", value: "/", display: "/" },
  { id: "multiply", value: "*", display: "X" },
  { id: "seven", value: 7, display: "7" },
  { id: "eight", value: 8, display: "8" },
  { id: "nine", value: 9, display: "9" },
  { id: "subtract", value: "-", display: "-" },
  { id: "four", value: 4, display: "4" },
  { id: "five", value: 5, display: "5" },
  { id: "six", value: 6, display: "6" },
  { id: "add", value: "+", display: "+" },
  { id: "one", value: 1, display: "1" },
  { id: "two", value: 2, display: "2" },
  { id: "three", value: 3, display: "3" },
  { id: "equals", value: "=", display: "=" },
  { id: "zero", value: 0, display: "0" },
  { id: "decimal", value: ".", display: "." },
];
// This element is necessary to add last clicked digit after computing
let element = null;

const App = () => {
  const [valueDisplayed, setValueDisplayed] = useState("0");
  const [isComputed, setIsComputed] = useState(false);
  const [DigicAfterComputed, setDigitAfterComputed] = useState(false);
  const [groupOfNumbers, setGroupOfNumbers] = useState("");

  useEffect(() => {
    document.addEventListener("keydown", handleCalculator);
    return () => {
      document.removeEventListener("keydown", handleCalculator);
    };
  });

  // this function clears display and adds last clicked digit after computing
  useEffect(() => {
    if (isComputed) {
      setIsComputed(false);
      if (element === ".") setValueDisplayed("0" + element);
      else setValueDisplayed(element);
      setDigitAfterComputed(false);
    }
  }, [DigicAfterComputed]);

  // control function
  const handleCalculator = (e) => {
    let value = null;
    if (e.key) value = e.key;
    else if (e.target.value) value = e.target.value;

    if (value === ",") value = ".";
    else if (value === "Enter") value = "=";
    else if (value === "Escape") value = "AC";
    else if (value === "Backspace") value = "BS";

    if (Number(value) || value === "0" || value === ".") handleDigit(value);
    else if (value === "AC") handleAC();
    else if (value === "BS") handleBS();
    else if (value === "=") handleEquals(value);
    else if (value === "/" || value === "*" || value === "-" || value === "+") handleOperations(value);
  };

  // Clear function
  const handleAC = () => {
    setGroupOfNumbers("");
    setValueDisplayed("0");
    if (isComputed) {
      setIsComputed(false);
    }
  };

  const handleBS = () => {
    if (groupOfNumbers.length >= 1) {
      setGroupOfNumbers(groupOfNumbers.slice(0, groupOfNumbers.length - 1));
      setValueDisplayed(valueDisplayed.slice(0, valueDisplayed.length - 1));
    }
  };

  // This function handles + - / *
  const handleOperations = (e) => {
    if (isComputed && valueDisplayed.includes("=")) return;

    setIsComputed(false);
    setGroupOfNumbers("");

    if (valueDisplayed.endsWith("/-") || valueDisplayed.endsWith("*-"))
      setValueDisplayed(valueDisplayed.slice(0, valueDisplayed.length - 2) + e);
    else if (e === "-" && (valueDisplayed.endsWith("/") || valueDisplayed.endsWith("*")))
      setValueDisplayed(valueDisplayed + e);
    else if (valueDisplayed.endsWith(".")) setValueDisplayed(valueDisplayed.slice(0, valueDisplayed.length - 1) + e);
    else if (valueDisplayed == "0" && e === "-") setValueDisplayed(e);
    else if (valueDisplayed == "0") setValueDisplayed("0" + e);
    else if (valueDisplayed === "/" || valueDisplayed === "*" || valueDisplayed === "-" || valueDisplayed === "+")
      setValueDisplayed(e);
    else {
      if (
        valueDisplayed.endsWith("/") ||
        valueDisplayed.endsWith("*") ||
        valueDisplayed.endsWith("-") ||
        valueDisplayed.endsWith("+")
      ) {
        setValueDisplayed(valueDisplayed.replace(/\W$/, e));
      } else setValueDisplayed(valueDisplayed + e);
    }
  };

  const handleDigit = (e) => {
    element = e;
    const value = e;
    if (isComputed) setDigitAfterComputed(true);

    if (groupOfNumbers.includes(".") && value === ".") return;
    if (valueDisplayed === "0" && value === ".") {
      setValueDisplayed("0" + value);
      setGroupOfNumbers("0" + value);
    } else if (groupOfNumbers === "" && value === ".") {
      setValueDisplayed(valueDisplayed + "0" + value);
      setGroupOfNumbers("0" + value);
    } else if (valueDisplayed === "-0") {
      setValueDisplayed("-" + value);
      setGroupOfNumbers("-" + value);
    } else if (valueDisplayed === "0") {
      setValueDisplayed(value);
      setGroupOfNumbers(value);
    } else if (groupOfNumbers === "0" && value === "0") return;
    else {
      setValueDisplayed(valueDisplayed + value);
      setGroupOfNumbers(groupOfNumbers + value);
    }
  };

  const handleEquals = (e) => {
    if (valueDisplayed.endsWith("/-") || valueDisplayed.endsWith("*-")) {
      setValueDisplayed(String(eval(valueDisplayed.slice(0, valueDisplayed.length - 2))));
      setGroupOfNumbers("");
      setIsComputed(true);
    } else if (
      valueDisplayed.endsWith("/") ||
      valueDisplayed.endsWith("*") ||
      valueDisplayed.endsWith("-") ||
      valueDisplayed.endsWith("+")
    ) {
      setValueDisplayed(String(eval(valueDisplayed.slice(0, valueDisplayed.length - 1))));
      setGroupOfNumbers("");
      setIsComputed(true);
    } else if (!valueDisplayed.match(/[\/*\-+]/) && isComputed) return;
    else if (!valueDisplayed.match(/[\/*\-+]/)) {
      if (valueDisplayed.length > 9) {
        setValueDisplayed(valueDisplayed);
        setGroupOfNumbers("");
        setIsComputed(true);
      } else if (eval(valueDisplayed) == 0) setValueDisplayed(0);
      else {
        setValueDisplayed(valueDisplayed + " = " + valueDisplayed);
        setIsComputed(true);
        setGroupOfNumbers("");
      }
    } else {
      setValueDisplayed(String(eval(valueDisplayed)));
      setIsComputed(true);
      setGroupOfNumbers("");
    }
  };

  return (
    <div className="calculator">
      <div id="display">
        <p>{valueDisplayed}</p>
      </div>
      <div className="calculator-buttons">
        <CalculatorButtons data={buttonsData} handleCalculator={handleCalculator} />
      </div>
    </div>
  );
};

const CalculatorButtons = (props) => {
  const renderCalculatorButtons = props.data.map((item) => {
    if (item.id === "backspace")
      return (
        <button onClick={props.handleCalculator} id={item.id} value={item.value} key={item.id}>
          <span className="material-icons-outlined md-36">{item.display}</span>
        </button>
      );
    return (
      <button onClick={props.handleCalculator} id={item.id} value={item.value} key={item.id}>
        {item.display}
      </button>
    );
  });
  return renderCalculatorButtons;
};

ReactDOM.render(<App />, document.getElementById("root"));
