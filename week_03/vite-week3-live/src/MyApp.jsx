//import { Fragment } from "react";
function MyApp() {
  const num = 100;
  return (
    <>
      <h2>MyApp</h2>
      <h3>123</h3>
      <div
        style={{
          width: num + "px",
          height: `${num}px`,
          backgroundColor: "red",
        }}
      ></div>
      <h1 className="text-3xl font-bold underline">Helllo world!</h1>
    </>
  );
}

export default MyApp;
