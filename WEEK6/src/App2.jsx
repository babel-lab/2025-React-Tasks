import { useState, useEffect, useRef } from "react";

import axios from "axios";

import * as bootstrap from "bootstrap";

import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

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

function App() {
  
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
const[pagination,setPagination]=useState({});
  const productModalRef = useRef(null);


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
  
  //登入確認
  const getToken = () =>
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

  const checkLogin = async () => {
    const token = getToken();

    //console.log("[check] token =", token);
    if (!token) {
      console.log("[check] 沒拿到 token");
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
      console.log("登入確認成功");
// ✅ 這裡一定要設為已登入，否則你的 UI/流程會不同步
    setIsAuth(true);
      //TASK3: 取得產品列表頁
      getProducts();
    } catch (error) {
      //console.log(error.response?.data.message);
      //console.log("[check] axios err =", error);
      //console.log("[check] message =", error?.message);
      //console.log("[check] code =", error?.code);
      //console.log("[check] response =", error?.response);
      //console.log("[check] status =", error?.response?.status);
      //console.log("[check] data =", error?.response?.data);
      console.log("登入確認錯誤");
    }
  };


  //取產品列表
  const getProducts = async (page=1) => {

    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      //console.log("response:" + response);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response);
    }
  };


  //TASK3
  useEffect(() => {
    checkLogin();

    //畫面完成後才做綁定
    productModalRef.current = new bootstrap.Modal("#productModal", {
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

    productModalRef.current.show();
  };
  //隱藏
  const closeModal = () => {
    productModalRef.current.hide();
  };

  //網頁顯示內容
  return (
    <>
      {!isAuth ? (
        <Login getProducts={getProducts}  setIsAuth={setIsAuth} />
      ) : (
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
            <thead><tr><th scope="col">主圖</th>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th width="100">單位</th>
                <th width="100">尺寸</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
                <th>其他副圖</th>
              </tr></thead>
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
                        product.imagesUrl.filter((url) => url).length ===
                          0) && <span className="text-muted small"></span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination  pagination={pagination} onChangePage={getProducts} />
        </div>
      )}
<ProductModal 
modalType={modalType}
    templateProduct={templateProduct}
  getProducts={getProducts}
    closeModal={closeModal}
/>
      
    </>
  );
}

export default App;
