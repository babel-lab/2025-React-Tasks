import { NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../slice/authSlice";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActive = ({ isActive }) =>
    isActive ? "nav-link bg-warning h4" : "nav-link h4 ";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="px-4">
        {/* nav 加 w-100，讓 ms-auto 生效 */}
        <ul className="nav w-100 align-items-center">
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

          {/* ✅ 右側登出 */}
          <li className="nav-item ms-auto">
            <button
              type="button"
              className="nav-link h4"
              onClick={handleLogout}
            >
              登出
            </button>
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
