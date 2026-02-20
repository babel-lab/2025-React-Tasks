import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Cart() {
  const [cart, setCart] = useState([]);
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
                      defaultValue={cartItem.qty}
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
