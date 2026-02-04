import { useState } from "react";

let num = 0;
function AppUseState() {
  const [count, setCount] = useState(1);
  console.log("元件運行次數:", num);
  num++;

  //   setInterval(() => {
  //     console.log("setInterval");
  //   }, 1000);
  console.log("更新後的 count:", count);

  const [data, setData] = useState({
    id: "12345",
    imageUrl: "",
    title: "高山烏龍茶",
    category: "飲品",
    unit: "罐",
    originPrice: "350",
    price: "299",
    description: "來自台灣高山的優質烏龍茶,口感甘醇,香氣濃郁。",
    content: "每罐150克,,適合家庭日常飲用或作為禮品贈送。",
    isEnabled: true,
    imagesUrl: [],
  });

  return (
    <>
      <h1>AppUseState </h1>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
          console.log("count: ", count);
        }}
      >
        {" "}
        {count}
      </button>
      <hr />
      {JSON.stringify(data)}
      <input
        type="text"
        onChange={(e) => {
          const { value } = e.target;
          setData({
            ...data,
            title: value,
          });
          console.log("data:", data);
        }}
      />
    </>
  );
}

export default AppUseState;
