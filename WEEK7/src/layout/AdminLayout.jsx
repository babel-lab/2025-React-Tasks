import { NavLink, Outlet } from "react-router";

function AdminLayout() {
  const handleActive = ({ isActive }) => {
    return isActive ? "nav-link bg-warning h4" : "nav-link h4 ";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="px-4">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className={handleActive} to="/">
              前台首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/admin/product">
              後台產品列表
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={handleActive} to="/admin/order">
              後台訂單列表
            </NavLink>
          </li>
        </ul>
      </header>

      {/* 🔑 main 撐滿剩下高度，讓子頁可以在這塊置中 */}
      <main className="px-4 flex-grow-1 d-flex">
        <Outlet />
      </main>

      <footer className="px-4">
        <small className="text-body-secondary">2026 MyWeb</small>
      </footer>
    </div>
  );
}

export default AdminLayout;
