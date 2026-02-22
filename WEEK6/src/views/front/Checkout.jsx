import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";

/*
render(<RotatingLines
visible={true}
height="96"
width="96"
color="grey"
strokeWidth="5"
animationDuration="0.75"
ariaLabel="rotating-lines-loading"
wrapperStyle={{}}
wrapperClass=""
/>)
*/

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Checkout() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  //const [cart, setCart] = useState([]);
  const [cart, setCart] = useState({ carts: [], final_total: 0 });

  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);

  //useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response.data.data);
      setCart(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  //打API
  //取得購物車列表 GET ${API_BASE}/api/${API_PATH}/cart
  useEffect(() => {
    //取得產品列表
    const getProducts = async () => {
      try {
        console.log("API:", `${API_BASE}/api/${API_PATH}/products`);
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );

        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
    getCart();

    //檢視單一商品初始化
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    //關閉移除焦點

    //Modal 關閉時時除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  //加入購物車
  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(response.data);

      //更新小計/總計金額, 取得購物車列表
      //const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);

      const response2 = await getCart();
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingCartId(null);
    }
  };

  //使用者輸入INPUT數字, 更新商品數量
  //更新商品數量: PUT ${API_BASE)/api/${API_PATH}/cart/${cartId}
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = { product_id: productId, qty };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      console.log(response.data);

      //更新小計/總計金額
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  //清除單一筆購物車: DELETE ${API_BASE}/api/${API_PATH}/cart/${id}
  const delCart = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      console.log(response.data);

      //更新小計/總計金額
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  //清空購物: DELETE $(API_BASE)/api/${API_PATH}/carts
  const clearCart = async () => {
    if (!window.confirm("確定要清空購物車嗎？")) return;

    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(response.data);

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const onSubmit = async (formData) => {
    // 防呆：購物車為空不能送出
    if ((cart?.carts?.length ?? 0) === 0) {
      alert("購物車是空的，請先加入商品再送出訂單");
      return;
    }

    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      console.log(response.data);

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      console.log(response2.data.data);
      setCart(response2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  //查看產品詳細
  //取得單一商品資訊
  const handleView = async (id) => {
    //按下詳細按鈕
    setLoadingProductId(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`,
      );
      console.log(response.data.product);
      //查看詳細後, 把資料放在PRODUCT裡
      setProduct(response.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }

    //彈出單一商品檢視MODAL
    //使用 ref 控制 Modal
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  //handleView(id);

  //檢查購物車是不是有商品
  const isCartEmpty = (cart?.carts?.length ?? 0) === 0;

  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價: {product.origin_price}</del>
                <div className="h5">特價: {product.price}</div>
              </td>

              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines color="grey" width={80} height={24} />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <RotatingLines color="grey" width={80} height={24} />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row">
        <h2>購物車列表</h2>
      </div>
      <div className="row">
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {(cart?.carts ?? []).map((cartItem) => (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => delCart(cartItem.id)}
                  >
                    刪除
                  </button>
                </td>
                <th scope="row">{cartItem.product.title}</th>
                <td>
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="number"
                      className="form-control"
                      aria-label="sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      value={cartItem.qty}
                      min={1}
                      onChange={(e) => {
                        /*
                        updateCart(
                          cartItem.id,
                          cartItem.product_id,
                          Number(e.target.value),
                        )
                          */
                        const qty = Number(e.target.value);
                        if (!Number.isFinite(qty) || qty < 1) return;
                        updateCart(cartItem.id, cartItem.product_id, qty);
                      }}
                    />
                    <small className="text-body-secondary">
                      / {cartItem.product.unit}
                    </small>
                  </div>
                </td>
                <td className="text-end">{currency(cartItem.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計:
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>

        {/* 結帳頁面 開始 */}
        <div className="my-5 row justify-content-center checkout-form">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                defaultValue="test@gmail.com"
                {...register("email", {
                  required: "請輸入 Email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email 格式不正確",
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="請輸入 姓名"
                defaultValue="王小明"
                {...register("name", {
                  required: "請輸入 姓名",
                  minLength: { value: 2, message: "姓名最少 2 個字" },
                })}
              />
              {errors.name && (
                <p className="text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                className="form-control"
                placeholder="請輸入 電話"
                defaultValue="0912345678"
                {...register("tel", {
                  required: "請輸入 電話",
                  pattern: {
                    value: /^\d+$/,
                    message: "電話僅能輸入數字(最少8碼)",
                    minLength: {
                      value: 8,
                      message: "電話僅能輸入數字(最少 8 碼)",
                    },
                  },
                })}
              />
              {errors.tel && (
                <p className="text-danger">{errors.tel.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                住址
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control"
                placeholder="請輸入 地址"
                defaultValue="台北市信義區5段7號"
                {...register("address", {
                  required: "請輸入 地址",
                })}
              />
              {errors.address && (
                <p className="text-danger">{errors.address.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                cols="30"
                rows="4"
                {...register("message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button className="btn btn-danger" disabled={isCartEmpty}>
                送出訂單
              </button>
              {isCartEmpty && (
                <small className="d-block text-danger mt-2">
                  購物車為空，無法送出訂單
                </small>
              )}
            </div>
            {/* 結帳頁面 結束 */}
          </form>
        </div>
      </div>
      {/* 引入單一商品檢視 */}
      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}
export default Checkout;
