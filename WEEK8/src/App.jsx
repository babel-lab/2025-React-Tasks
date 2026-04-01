import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <>
      {/* 在根元件引入ROUTER */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
