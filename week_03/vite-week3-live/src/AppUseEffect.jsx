import { useEffect, useState } from "react";

let num = 0;
function AppUseEffect() {
  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(1);
  console.log("元件運行次數:", num);
  num++;

  let btn1 = null;
  useEffect(() => {
    btn1 = document.querySelector("#btn1");

    console.log("useEffect執行次數:", 1);

    console.log("btn1: " + btn1);
  }, [count]);

  //btn1.addEventListener(() => {});

  return (
    <>
      <h1>AppUseEffect</h1>
      {console.log("JSX 運行:", count)}
      <button
        id="btn1"
        type="button"
        onClick={() => {
          setCount(count + 1);
          console.log("count1: ", count);
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
          console.log("count2: ", count2);
        }}
      >
        {count2}
      </button>
    </>
  );
}

export default AppUseEffect;
