import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

function FrontendLayout() {
  return (
    <>
      {/* 基本版型 */}
      <Header />
      <main>
        {/* 只抽換中間 */}
        <Outlet></Outlet>
      </main>
      <Footer />
    </>
  );
}

export default FrontendLayout;
