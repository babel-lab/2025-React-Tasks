import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createAsyncDelCart,
  createAsyncGetCart,
  createAsyncUpdateCart,
} from "../../slice/cartSlice";
import { currency } from "../../utilits/filter";

function Cart() {
  //取得購物車內容
  const carts = useSelector((state) => state.cart.carts);
  const total = useSelector((state) => state.cart.total);
  const final_total = useSelector((state) => state.cart.final_total);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //頁面進來先抓購物車資料
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  //刪除購物車商品
  const handleRemoveCart = (e, id) => {
    e.preventDefault();
    dispatch(createAsyncDelCart(id));
  };

  const handleUpdateCartQty = (e, cartItem, type) => {
    e.preventDefault();

    let newQty = cartItem.qty;

    if (type === "plus") {
      newQty += 1;
    }

    if (type === "minus") {
      //若目前商品數量已是1，再按減號時，提示是否刪除商品
      if (cartItem.qty === 1) {
        const isDelete = window.confirm("商品數量已是 1，是否要刪除此商品？");

        if (isDelete) {
          dispatch(createAsyncDelCart(cartItem.id));
        }

        return;
      }

      newQty -= 1;
    }

    dispatch(
      createAsyncUpdateCart({
        cartId: cartItem.id,
        product_id: cartItem.product.id,
        qty: newQty,
      }),
    );
  };

  //前往結帳處理
  const handleGoCheckout = (e) => {
    e.preventDefault();

    //若購物車沒有商品，則不進入結帳頁
    if (!carts.length) {
      window.alert("購物車是空的，請先加入商品");
      return;
    }

    //導向結帳頁
    navigate("/checkout");
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex justify-content-center">
        <div
          className="bg-white w-100"
          style={{
            maxWidth: "720px",
            minHeight: "calc(100vh - 56px - 76px)",
            padding: "24px 16px",
            overflowX: "hidden",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="mt-0 mb-0">Cart Detail</h2>
          </div>

          {
            //渲染購物車內容
            carts.map((cartItem) => (
              <div
                className="d-flex flex-column flex-md-row mt-4 bg-light overflow-hidden"
                key={cartItem.id}
              >
                <img
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.title}
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "220px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  className="d-block d-md-none"
                />

                <img
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.title}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  className="d-none d-md-block"
                />

                <div
                  className="d-flex flex-column flex-grow-1 position-relative"
                  style={{
                    padding: "16px",
                    minWidth: 0,
                  }}
                >
                  <a
                    href="#"
                    className="position-absolute text-dark"
                    style={{
                      top: "16px",
                      right: "16px",
                    }}
                    onClick={(e) => handleRemoveCart(e, cartItem.id)}
                  >
                    <i className="fas fa-times"></i>
                  </a>

                  <p className="mb-1 fw-bold pe-4">{cartItem.product.title}</p>
                  <p
                    className="mb-3 text-muted"
                    style={{
                      fontSize: "14px",
                      wordBreak: "break-word",
                    }}
                  >
                    {cartItem.product.description}
                  </p>

                  <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 w-100">
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{
                        width: "100%",
                        maxWidth: "220px",
                        border: "1px solid #dee2e6",
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        flexShrink: 0,
                      }}
                    >
                      <a
                        href="#"
                        className="text-dark text-decoration-none"
                        onClick={(e) => handleUpdateCartQty(e, cartItem, "minus")}
                      >
                        <i className="fas fa-minus"></i>
                      </a>

                      <input
                        type="text"
                        className="form-control border-0 text-center shadow-none bg-transparent px-0"
                        value={cartItem.qty}
                        readOnly
                        style={{
                          maxWidth: "60px",
                        }}
                      />

                      <a
                        href="#"
                        className="text-dark text-decoration-none"
                        onClick={(e) => handleUpdateCartQty(e, cartItem, "plus")}
                      >
                        <i className="fas fa-plus"></i>
                      </a>
                    </div>

                    <p className="mb-0 ms-sm-auto fw-bold text-sm-end">
                      NT$ {currency(cartItem.final_total || cartItem.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          }

          <table className="table mt-4 text-muted" style={{ tableLayout: "fixed" }}>
            <tbody>
              <tr>
                <th scope="row" className="border-0 px-0 font-weight-normal">
                  小計
                </th>
                <td className="text-end border-0 px-0">
                  NT$ {currency(total)}
                </td>
              </tr>
              {/* 
              
              <tr>
                <th
                  scope="row"
                  className="border-0 px-0 pt-0 font-weight-normal"
                >
                  總計
                </th>
                <td className="text-end border-0 px-0 pt-0">
                  NT$ {currency(final_total)}
                </td>
              </tr>
              
              */}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
            <p className="mb-0 h4 fw-bold">總計</p>
            <p className="mb-0 h4 fw-bold text-end">NT$ {currency(final_total)}</p>
          </div>

          <a
            href="#"
            className="btn btn-dark w-100 mt-4 rounded-0 py-3"
            onClick={handleGoCheckout}
          >
            前往結帳
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cart;