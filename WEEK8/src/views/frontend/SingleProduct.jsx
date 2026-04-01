import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { currency } from "../../utilits/filter";
import { useDispatch } from "react-redux";
import { createAsyncAddCart } from "../../slice/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  // 控制下方手風琴開關
  const [openSection, setOpenSection] = useState("description");

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? "" : section));
  };

  //按鈕送出加入購物車
  const handleAddToCart = () => {
    dispatch(
      createAsyncAddCart({
        product_id: product.id,
        qty,
      }),
    );
  };

  // CALL取得詳細內容的API
  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`
        );
        console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response || error);
      }
    };

    getProduct();
  }, [id]);

  return (
    <div
      className="container"
      style={{
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          minHeight: "400px",
          width: "100%",
          backgroundImage: `url(${product.imageUrl})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div
        className="mt-4 mb-7"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* 左側：商品資訊 */}
        <div
          style={{
            flex: "999 1 520px",
            minWidth: "280px",
            width: "100%",
          }}
        >
          <h2 className="mb-0">{product.title}</h2>

          <div className="d-flex align-items-center mt-2 flex-wrap">
            <p className="fw-bold mb-0 me-3">NT${currency(product.price)}</p>
            {product.origin_price && (
              <del className="text-muted">
                NT${currency(product.origin_price)}
              </del>
            )}
          </div>

          <p className="mt-3">{product.description}</p>

          <div
            className="my-4"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {product.imagesUrl?.map((image, index) => (
              <img
                key={`${product.id}-${index}`}
                src={image}
                alt=""
                style={{
                  width: "100%",
                  maxWidth: "240px",
                  flex: "1 1 180px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ))}
          </div>

          <div className="border border-bottom border-top-0 border-start-0 border-end-0 mb-3">
            {/* 商品描述 */}
            <div className="border-0">
              <div
                className="py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0"
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("description")}
              >
                <div className="d-flex justify-content-between align-items-center pe-1">
                  <h4 className="mb-0">商品描述</h4>
                  <i
                    className={`fas ${
                      openSection === "description" ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </div>
              </div>

              {openSection === "description" && (
                <div className="pb-5">{product.description || "尚無商品描述"}</div>
              )}
            </div>

            {/* 商品內容 */}
            <div className="border-0">
              <div
                className="py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0"
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("content")}
              >
                <div className="d-flex justify-content-between align-items-center pe-1">
                  <h4 className="mb-0">商品內容</h4>
                  <i
                    className={`fas ${
                      openSection === "content" ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </div>
              </div>

              {openSection === "content" && (
                <div className="pb-5">{product.content || "尚無商品內容"}</div>
              )}
            </div>

            {/* 商品資訊 */}
            <div className="border-0">
              <div
                className="py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0"
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("info")}
              >
                <div className="d-flex justify-content-between align-items-center pe-1">
                  <h4 className="mb-0">商品資訊</h4>
                  <i
                    className={`fas ${
                      openSection === "info" ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </div>
              </div>

              {openSection === "info" && (
                <div className="pb-5">
                  <p className="mb-2">分類：{product.category || "未分類"}</p>
                  <p className="mb-0">單位：{product.unit || "-"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側：購物按鈕區 */}
        <div
          style={{
            flex: "1 1 320px",
            minWidth: "280px",
            width: "100%",
          }}
        >
          <div className="input-group mb-3 border mt-3">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon1"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>

            <input
              type="text"
              className="form-control border-0 text-center my-auto shadow-none"
              placeholder=""
              aria-label="qty"
              aria-describedby="button-addon1"
              value={qty}
              min="1"
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />

            <div className="input-group-append">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon2"
                onClick={() => setQty((prev) => prev + 1)}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-dark w-100 rounded-0 py-3"
            onClick={handleAddToCart}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;