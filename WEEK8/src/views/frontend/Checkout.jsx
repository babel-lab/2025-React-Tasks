import axios from "axios";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { currency } from "../../utilits/filter";
import { createAsyncGetCart } from "../../slice/cartSlice";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const carts = useSelector((state) => state.cart.carts);
  const final_total = useSelector((state) => state.cart.final_total);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  // 取得購物車
const getCart = useCallback(async () => {
  dispatch(createAsyncGetCart());
}, [dispatch]);

useEffect(() => {
  getCart();
}, [getCart]);

  // 送出訂單
  const onSubmit = async (data) => {
    if (!carts.length) {
      alert("購物車是空的");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address,
          },
          message: data.message || "",
        },
      });

      const orderId = res.data.orderId;

      getCart();
      reset();
      navigate(`/checkout-success/${orderId}`);
    } catch (err) {
      alert("訂單失敗");
      console.log(err);
    }
  };

  return (
    <div className="bg-light pt-5 pb-7 overflow-hidden">
      <div className="container">
        <div className="d-flex flex-column-reverse flex-md-row justify-content-center align-items-stretch gap-4">
          {/* 左側表單 */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <div className="bg-white p-4 h-100 rounded">
              <h4 className="fw-bold mb-4">1. Contact Form</h4>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    {...register("email", {
                      required: "Email 必填",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Email 格式不正確",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Name"
                    {...register("name", {
                      required: "姓名必填",
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="tel"
                    className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                    placeholder="Phone"
                    {...register("tel", {
                      required: "電話必填",
                      pattern: {
                        value: /^[0-9+\-()\s]{8,20}$/,
                        message: "電話格式不正確",
                      },
                    })}
                  />
                  {errors.tel && (
                    <div className="invalid-feedback">
                      {errors.tel.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    placeholder="Address"
                    {...register("address", {
                      required: "地址必填",
                    })}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Message"
                    rows="4"
                    {...register("message")}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 mt-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "送出中..." : "送出訂單"}
                </button>
              </form>
            </div>
          </div>

          {/* 右側訂單 */}
          <div style={{ flex: "0 0 360px", maxWidth: "100%", minWidth: 0 }}>
            <div className="border bg-white p-4 h-100 rounded">
              <h4 className="mb-4">Order Detail</h4>

              {carts.length === 0 ? (
                <p className="text-muted mb-0">目前購物車沒有商品</p>
              ) : (
                carts.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-start mb-3"
                    style={{ minWidth: 0 }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        flexShrink: 0,
                        borderRadius: "6px",
                      }}
                    />
                    <div className="ms-2 flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <p
                          className="mb-1"
                          style={{
                            wordBreak: "break-word",
                            marginRight: "8px",
                          }}
                        >
                          {item.product.title}
                        </p>
                        <p className="mb-1 flex-shrink-0">x{item.qty}</p>
                      </div>
                      <p className="text-end mb-0">NT$ {currency(item.final_total)}</p>
                    </div>
                  </div>
                ))
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total</h5>
                <h5 className="mb-0">NT$ {currency(final_total)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;