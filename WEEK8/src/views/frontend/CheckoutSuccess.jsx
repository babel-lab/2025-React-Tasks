import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { currency } from "../../utilits/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function CheckoutSuccess() {
  const { id } = useParams(); // 訂單 id
  const [order, setOrder] = useState(null);

  // 取得訂單
  const getOrder = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/order/${id}`
      );
      setOrder(res.data.order);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);

  if (!id) {
  return <div className="container py-5">找不到訂單編號</div>;
}

if (!order) {
  return <div className="container py-5">載入中...</div>;
}

  return (
    <div className="bg-light py-5 overflow-hidden">
      <div className="container">
        {/* FLEX 主結構 */}
        <div className="d-flex flex-column flex-md-row gap-4">

          {/* 左側：成功訊息 */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <div className="bg-white p-4 h-100 rounded">
              <h2 className="fw-bold mb-3">🎉 訂單成立成功！</h2>
              <p className="text-muted">
                感謝您的購買，我們已收到您的訂單，將盡快為您處理。
              </p>

              <div className="mt-4">
                <p className="mb-1">
                  <strong>訂單編號：</strong> {order.id}
                </p>
                <p className="mb-1">
                  <strong>訂購人：</strong> {order.user.name}
                </p>
                <p className="mb-1">
                  <strong>Email：</strong> {order.user.email}
                </p>
              </div>

              <Link
                to="/"
                className="btn btn-outline-dark mt-4 w-100"
              >
                回首頁
              </Link>
            </div>
          </div>

          {/* 右側：訂單內容 */}
          <div style={{ flex: "0 0 360px", maxWidth: "100%", minWidth: 0 }}>
            <div className="bg-white p-4 rounded h-100">
              <h4 className="mb-4">Order Detail</h4>

              {Object.values(order.products).map((item) => (
                <div
                  key={item.id}
                  className="d-flex mb-3"
                  style={{ minWidth: 0 }}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      flexShrink: 0,
                      borderRadius: "6px",
                    }}
                  />

                  <div
                    className="ms-2 flex-grow-1"
                    style={{ minWidth: 0 }}
                  >
                    <div className="d-flex justify-content-between">
                      <p
                        className="mb-1"
                        style={{ wordBreak: "break-word" }}
                      >
                        {item.product.title}
                      </p>
                      <p className="mb-1">x{item.qty}</p>
                    </div>

                    <p className="text-end mb-0">
                      {currency(item.final_total)}
                    </p>
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <h5>Total</h5>
                <h5>{currency(order.total)}</h5>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;