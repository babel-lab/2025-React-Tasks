import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router"; // ✅ 已搬到 ProtectedRoute 做導頁，這裡先不需要

import axios from "axios";

import * as bootstrap from "bootstrap";
import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
import "../../assets/style.css";

// import { useDispatch } from "react-redux"; // ✅ 目前沒有 dispatch(createAsyncMessage)，先不需要
// import { createAsyncMessage } from "../../slice/messageSlice"; // ✅ 同上
import useMessage from "../../hooks/useMessage";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [], //陣列要特殊處理
  size: "",
};

function AdminProducts() {
  // ✅ 已由 ProtectedRoute 做登入驗證，這裡不再需要 isAuth/checkingAuth
  // const [isAuth, setIsAuth] = useState(false);

  //補：避免畫面先 render 後台內容再被導頁
  //const [checkingAuth, setCheckingAuth] = useState(true);

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});

  //原本用來存 bootstrap modal instance
  const productModalRef = useRef(null);

  // const dispatch = useDispatch(); // ✅ 目前沒用到

  const { showError, showSuccess } = useMessage();

  // const navigate = useNavigate(); // ✅ 已由 ProtectedRoute 導頁，這裡不再需要

  const API_BASE = import.meta.env.VITE_API_BASE;
  const API_PATH = import.meta.env.VITE_API_PATH;

  /*
  //登入確認（✅ 已搬到 ProtectedRoute.jsx，這裡不需要）
  const getToken = () =>
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

  //補：清除 token（登入失效時使用）
  const clearToken = () => {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common.Authorization;
  };

  const checkLogin = async () => {
    const token = getToken();

    //console.log("[check] token =", token);

    if (!token) {
      console.log("[check] 沒拿到 token");
      clearToken();
      setIsAuth(false);
      setCheckingAuth(false);
      navigate("/login", { replace: true });
      return;
    }

    // ✅ 先把 token 設到 axios 預設 header（後面所有 admin API 都吃得到）
    axios.defaults.headers.common.Authorization = token;

    try {
      const response = await axios.post(
        `${API_BASE}/api/user/check`,
        {},
        { headers: { Authorization: token } },
      );

      //console.log(response.data);
      //console.log("[check] ok", response.data);
      //console.log("登入確認成功");

      // ✅ 這裡一定要設為已登入，否則你的 UI/流程會不同步
      setIsAuth(true);

      //TASK3: 取得產品列表頁
      getProducts();
    } catch (error) {
      console.log("登入確認錯誤");

      //補：token 失效，清除後導回登入頁
      clearToken();
      setIsAuth(false);
      navigate("/login", { replace: true });
    } finally {
      //補：登入檢查結束
      setCheckingAuth(false);
    }
  };
  */

  //取產品列表
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      //console.log("response:" + response);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      showSuccess("取得成功");
    } catch (error) {
      console.log(error.response);
      //dispatch(createAsyncMessage(error.response.data));
      showError(error.response.data.message);
    }
  };

  // ✅ ProtectedRoute 驗證通過才會進來這頁，所以進來就直接抓產品
  useEffect(() => {
    getProducts();
  }, []);

  //補：等 ProductModal 的 DOM (#productModal) 確實存在後，再初始化 bootstrap modal
  //（避免：Cannot read properties of undefined (reading 'backdrop')）
  useEffect(() => {
    const modalEl = document.getElementById("productModal");
    if (!modalEl) return;

    //畫面完成後才做綁定（用 element，不用 selector string）
    productModalRef.current = bootstrap.Modal.getOrCreateInstance(modalEl, {
      keyboard: false,
    });
  }, []);

  // Modal 關閉時移除焦點
  /*
  document
    .querySelector("#productModal")
    .addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  */

  //已經選到DOM元素了
  //開啟
  const openModal = (type, product) => {
    //console.log(product);
    setModalType(type);
    //把產品設定進去MODAL
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });

    //補：避免 modal instance 還沒建立就 show（例如剛進頁/剛刷新）
    productModalRef.current?.show();
  };

  //隱藏
  const closeModal = () => {
    productModalRef.current?.hide();
  };

  //網頁顯示內容
  return (
    <>
      {/* ✅ 已由 ProtectedRoute 處理登入驗證/導頁，這裡不需要 checkingAuth / isAuth 判斷 */}
      <div className="container">
        <h2>產品列表</h2>
        <div className="text-end mt-4 y-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>

        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">主圖</th>
              <th scope="col">分類</th>
              <th scope="col">產品名稱</th>
              <th width="100">單位</th>
              <th width="100">尺寸</th>
              <th scope="col">原價</th>
              <th scope="col">售價</th>
              <th scope="col">是否啟用</th>
              <th scope="col">編輯</th>
              <th>其他副圖</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                {/* 新增主圖預覽欄位 */}
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    className="img-thumbnail"
                  />
                </td>
                <td>{product.category}</td>
                <th scope="row">{product.title}</th>

                {/* 新增單位欄位 */}
                <td>{product.unit}</td>
                <td>{product.size}</td>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td className={`${product.is_enabled && "text-success"}`}>
                  {product.is_enabled ? "啟用" : "未啟用"}
                </td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal("delete", product)}
                    >
                      刪除
                    </button>
                  </div>
                </td>

                {/* 新增副圖列表 */}
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    {product.imagesUrl &&
                      product.imagesUrl.map((url, index) =>
                        url ? (
                          <img
                            key={index}
                            src={url}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            className="img-thumbnail"
                            alt={`副圖 ${index + 1}`}
                          />
                        ) : null,
                      )}
                    {(!product.imagesUrl ||
                      product.imagesUrl.filter((url) => url).length === 0) && (
                      <span className="text-muted small"></span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        getProducts={getProducts}
        closeModal={closeModal}
      />
    </>
  );
}

export default AdminProducts;
