import { NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slice/authSlice";

function FrontendLayout() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActive = ({ isActive }) =>
    isActive ? "nav-link bg-warning h4" : "nav-link h4";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="px-4">
        <ul className="nav w-100 align-items-center">
          {/* 左側：前台連結 */}
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

          {/* 右側：登入 / 後台管理 + 登出（靠右） */}
          <li className="nav-item ms-auto">
            {!isAuth ? (
              <NavLink className={handleActive} to="/login">
                登入
              </NavLink>
            ) : (
              <div className="d-flex align-items-center">
                <NavLink className={handleActive} to="/admin/product">
                  後台管理
                </NavLink>

                <button
                  type="button"
                  className="nav-link h4"
                  onClick={handleLogout}
                >
                  登出
                </button>
              </div>
            )}
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
