import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

let num = 0;

function AppUseRef() {
  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(1);
  const ref = useRef(1);
  const btnRef = useRef(null);

  console.log("元件運行次數:", num);
  num++;

  useEffect(() => {
    let btn1 = null;
    //btn1 = document.querySelector("#btn1");

    //console.log("useEffect執行次數:", 1);

    //console.log("btn1: " + btn1);
    console.log("btnRef.current: ", btnRef.current);
    console.log(
      "document.querySelector('#btn1'): ",
      document.querySelector("#btn1"),
    );
  }, [count]);

  console.log("ref:", ref);

  //btn1.addEventListener(() => {});

  const canvasRef = useRef(null);
  useEffect(() => {
    new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <>
      <h1>圖表</h1>
      <canvas ref={canvasRef}></canvas>
      <h2>AppUseRef</h2>
      <button
        ref={btnRef}
        id="btn1"
        type="button"
        onClick={() => {
          setCount(count + 1);
          //console.log("count1: ", count);
        }}
      >
        {count}
      </button>
      <hr />
      <button
        id="btn2"
        type="button"
        onClick={() => {
          setCount2(count2 + 1);
          //console.log("count2: ", count2);
        }}
      >
        {count2}
      </button>
      <hr />
      <button
        type="button"
        onClick={() => {
          ref.current++;
        }}
      >
        {ref.current}
      </button>
    </>
  );
}

export default AppUseRef;
