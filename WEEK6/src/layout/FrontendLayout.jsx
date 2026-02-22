import { NavLink, Link, Outlet } from "react-router";

function FrontendLayout() {
  const handleActive = ({ isActive }) => {
    return isActive ? "nav-link bg-warning h4" : "nav-link h4 ";
  };

  return (
    <>
      <header className="px-4">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className={handleActive} to="/">
              首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/product">
              產品列表
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/cart">
              購物車
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/checkout">
              結帳
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/login">
              (後台)登入
            </NavLink>
          </li>
        </ul>
      </header>
      <main className="px-4">
        <Outlet />
      </main>
      <footer className="px-4">
        <small className="text-body-secondary">2026 MyWeb</small>
      </footer>
    </>
  );
}
export default FrontendLayout;
