import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createAsyncGetCart } from "../slice/cartSlice";



function Header() {
  // 在元件中取得redux裡的資料, 取得購物車內容, 是陣列
  const carts = useSelector((state) => state.cart.carts);

  // 在元件中取得async好的資料, 做store的什麼動作
  const dispatch = useDispatch();

  // 小版選單開關
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 進到畫面時取得購物車數量
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  // 點選選單項目後自動收合
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white sticky-top border-bottom">
      <div className="container">
        <nav
          className="navbar px-0 bg-white position-relative"
          style={{ minHeight: "72px" }}
        >
          {/* 左邊：桌機版選單 */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className="navbar-nav flex-row">
              
              <li className="nav-item">
                <Link className="nav-link ps-0 pe-3" to="/product">
                  產品列表
                </Link>
              </li>
              <li className="nav-item">
  <Link
    className="nav-link  ps-0 pe-3"
    to="/about"
    onClick={handleCloseMenu}
  >
    關於我們
  </Link>
</li>
<li className="nav-item">
  <Link
    className="nav-link  ps-0 pe-3"
    to="/faq"
    onClick={handleCloseMenu}
  >
    常見問題
  </Link>
</li>
            </ul>
          </div>

          {/* 左邊：手機版漢堡按鈕 */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 中間：品牌名稱 */}
          <Link
            className="navbar-brand position-absolute top-50 start-50 translate-middle m-0 fw-bold"
            to="/"
            onClick={handleCloseMenu}
            style={{ zIndex: 1 }}
          >
            甜在心蛋糕舖
          </Link>

          {/* 右邊：購物車 */}
          <div className="d-flex align-items-center ms-auto">
            <Link
              to="/cart"
              className="text-dark text-decoration-none position-relative d-inline-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={handleCloseMenu}
            >
              <i className="fa-solid fa-cart-shopping fs-5"></i>
              <span
                className="position-absolute badge rounded-pill bg-danger"
                style={{
                  top: "2px",
                  right: "0",
                  fontSize: "12px",
                  minWidth: "18px",
                  height: "18px",
                  lineHeight: "18px",
                  padding: "0 5px",
                }}
              >
                {carts.length}
              </span>
            </Link>
          </div>
        </nav>

        {/* 小版 / 收合選單 */}
        <div
          id="navbarNav"
          className={`d-lg-none bg-white border-top ${
            isMenuOpen ? "d-block" : "d-none"
          }`}
        >
          <ul className="navbar-nav py-2">
            <li className="nav-item">
              <Link
                className="nav-link px-0"
                to="/product"
                onClick={handleCloseMenu}
              >
                產品列表
              </Link>
            </li>
            <li className="nav-item">
  <Link
    className="nav-link px-0"
    to="/about"
    onClick={handleCloseMenu}
  >
    關於我們
  </Link>
</li>
<li className="nav-item">
  <Link
    className="nav-link px-0"
    to="/faq"
    onClick={handleCloseMenu}
  >
    常見問題
  </Link>
</li>

            {/* 小版購物車連結
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center justify-content-between px-0"
                to="/cart"
                onClick={handleCloseMenu}
              >
                <span>購物車</span>
                <span className="badge bg-danger">{carts.length}</span>
              </Link>
            </li>
            */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;