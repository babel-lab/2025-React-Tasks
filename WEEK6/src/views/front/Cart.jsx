import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  // ✅ API 回傳的是物件 { carts: [], final_total: ... }
  const [cart, setCart] = useState({ carts: [], final_total: 0 });

  // ✅ clearCart 有用到
  const [submitHint, setSubmitHint] = useState(null);

  // ✅ JSX 有用到，但原本沒宣告
  const isCartEmpty = (cart?.carts?.length ?? 0) === 0;

  //打API
  //取得購物車列表 GET ${API_BASE}/api/${API_PATH}/cart
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        console.log(response.data.data);
        setCart(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();
  }, []);

  //使用者輸入INPUT數字, 更新商品數量
  //更新商品數量: PUT ${API_BASE)/api/${API_PATH}/cart/${cartId}
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      // 防呆：數量不能小於 0
      if (qty < 0) qty = 0;

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

  //清空購物: DELETE ${API_BASE}/api/${API_PATH}/carts
  const clearCart = async () => {
    // ✅ 空車就不要打 API
    if (isCartEmpty) {
      setSubmitHint({ type: "error", text: "購物車已是空的，無需清空" });
      return;
    }

    if (!window.confirm("確定要清空購物車嗎？")) return;

    try {
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(response.data);

      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);

      setSubmitHint({ type: "success", text: "已清空購物車" });
    } catch (error) {
      console.log(error.response);
      setSubmitHint({ type: "error", text: "清空失敗，請稍後再試" });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <h2>購物車列表</h2>
      </div>

      <div className="row">
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearCart}
            disabled={isCartEmpty}
          >
            清空購物車
          </button>

          {isCartEmpty && (
            <small className="d-block text-body-secondary mt-2">
              購物車已是空的
            </small>
          )}

          {submitHint && (
            <small
              className={`d-block mt-2 ${
                submitHint.type === "success" ? "text-success" : "text-danger"
              }`}
            >
              {submitHint.text}
            </small>
          )}
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
                      defaultValue={cartItem.qty}
                      min="0"
                      onChange={(e) =>
                        updateCart(
                          cartItem.id,
                          cartItem.product_id,
                          Number(e.target.value),
                        )
                      }
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
      </div>
    </div>
  );
}

export default Cart;
