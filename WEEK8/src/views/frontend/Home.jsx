import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { currency } from "../../utilits/filter";
import { createAsyncAddCart } from "../../slice/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const feedbacks = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1655411880489-2f0d18785863?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "“蛋糕不會太甜，家人都很喜歡，回購好幾次了！”",
      from: "來自顧客真實回饋",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1772683530611-d201b4e4a307?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "“生日蛋糕超漂亮，小朋友看到超開心！”",
      from: "來自顧客真實回饋",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1680988087088-9afa97af9170?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "“配送準時又安全，蛋糕完全沒有壞掉！”",
      from: "來自顧客真實回饋",
    },
  ];

  // 取得商品資料
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.log(error.response || error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 搜尋後的商品篩選
  const filterProducts = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    if (!isSearched) {
      return products.slice(0, 6);
    }

    if (!lowerKeyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.title?.toLowerCase().includes(lowerKeyword) ||
        product.category?.toLowerCase().includes(lowerKeyword) ||
        product.description?.toLowerCase().includes(lowerKeyword)
      );
    });
  }, [products, keyword, isSearched]);

  // 點商品進詳細頁
  const handleViewDetail = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };

  // 加入購物車
  const handleAddCart = (product_id, qty = 1) => {
    dispatch(
      createAsyncAddCart({
        product_id,
        qty,
      }),
    );
  };

  // 搜尋按鈕
  const handleSearch = () => {
    setIsSearched(true);
  };

  // 顧客回饋：上一個
  const handlePrevFeedback = () => {
    setCurrentFeedbackIndex((prev) =>
      prev === 0 ? feedbacks.length - 1 : prev - 1,
    );
  };

  // 顧客回饋：下一個
  const handleNextFeedback = () => {
    setCurrentFeedbackIndex((prev) =>
      prev === feedbacks.length - 1 ? 0 : prev + 1,
    );
  };

  const currentFeedback = feedbacks[currentFeedbackIndex];

  return (
    <>
      {/* Hero 區 */}
      <div className="container overflow-hidden">
        <div
          className="d-flex flex-column flex-md-row-reverse"
          style={{ gap: "1.5rem" }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1595144780677-6d0b5abbd089?q=80&w=1743&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="蛋糕小舖主視覺"
              className="img-fluid"
              style={{ width: "100%", display: "block" }}
            />
          </div>

          <div
            className="d-flex flex-column justify-content-center mt-md-0 mt-3"
            style={{ flex: 1, minWidth: 0 }}
          >
            <h2 className="fw-bold">用甜點，療癒每一天</h2>
            <h5
              className="font-weight-normal text-muted mt-2"
              style={{ wordBreak: "break-word" }}
            >
              每天現做手工蛋糕，為你與家人帶來最溫暖的幸福時刻。
              無論是生日、慶祝或日常，都值得一份甜甜的心意。
            </h5>

            <div
              className="d-flex flex-column flex-sm-row mt-4"
              style={{ gap: "0.75rem" }}
            >
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="搜尋蛋糕口味（草莓、巧克力、乳酪...）"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                className="btn btn-dark rounded-0"
                type="button"
                id="search"
                onClick={handleSearch}
                style={{ whiteSpace: "nowrap" }}
              >
                搜尋甜點
              </button>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="row mt-4 g-4">
          {filterProducts.length > 0 ? (
            filterProducts.map((product) => (
              <div
                key={product.id}
                className="col-12 col-md-6 col-lg-4"
              >
                <div className="card border-0 h-100 position-relative">
                  <img
                    src={product.imageUrl}
                    className="card-img-top rounded-0"
                    alt={product.title}
                    style={{
                      objectFit: "cover",
                      aspectRatio: "4 / 3",
                      width: "100%",
                      display: "block",
                    }}
                  />

                  <div className="card-body p-0 d-flex flex-column">
                    <h4 className="mb-0 mt-4" style={{ wordBreak: "break-word" }}>
                      {product.title}
                    </h4>

                    <div
                      className="d-flex justify-content-between align-items-start mt-3 gap-3 flex-column"
                      style={{ minWidth: 0, flex: 1 }}
                    >
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p
                          className="card-text text-muted mb-2"
                          style={{ wordBreak: "break-word", lineHeight: 1.7 }}
                        >
                          {product.description}
                        </p>
                        <p className="text-muted mb-1">
                          NT$ {currency(product.price)}
                        </p>
                        <p
                          className="text-muted small mb-0"
                          style={{ wordBreak: "break-word" }}
                        >
                          商品分類：{product.category}
                        </p>
                      </div>

                      <div className="d-flex flex-row gap-2 w-100">
                        <button
                          className="btn btn-outline-dark rounded-0"
                          style={{ flex: 1 }}
                          onClick={(e) => handleViewDetail(e, product.id)}
                        >
                          查看蛋糕
                        </button>

                        <button
                          className="btn btn-dark rounded-0"
                          style={{ flex: 1 }}
                          onClick={() => handleAddCart(product.id, 1)}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-muted" style={{ lineHeight: 1.7 }}>
                目前查無符合條件的蛋糕商品，建議你換個關鍵字試試看，
                也可以直接瀏覽全部甜點，找到更多驚喜口味。
              </p>
            </div>
          )}
        </div>

        {!isSearched && (
          <div className="text-center mt-4 mb-5">
            <button
              className="btn btn-outline-dark rounded-0"
              onClick={() => setIsSearched(true)}
            >
              查看更多蛋糕
            </button>
          </div>
        )}
      </div>

      {/* 顧客回饋 */}
      <div className="bg-light mt-7">
        <div className="container py-7 overflow-hidden">
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <div className="bg-white p-4 p-md-5">
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src={currentFeedback.image}
                  alt="顧客評價"
                  className="rounded-circle mb-4"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div
                  style={{
                    width: "100%",
                    minWidth: 0,
                    wordBreak: "break-word",
                  }}
                >
                  <p className="h5 mb-3">{currentFeedback.text}</p>
                  <p className="text-muted mb-0">{currentFeedback.from}</p>
                </div>

                <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                    onClick={handlePrevFeedback}
                    aria-label="上一則回饋"
                    style={{
                      width: "44px",
                      height: "44px",
                      padding: 0,
                      flex: "0 0 auto",
                    }}
                  >
                    &lt;
                  </button>

                  <div className="d-flex align-items-center justify-content-center">
                    {feedbacks.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCurrentFeedbackIndex(index)}
                        aria-label={`切換到第 ${index + 1} 則回饋`}
                        className={`mx-1 border-0 rounded-circle ${
                          currentFeedbackIndex === index
                            ? "bg-dark"
                            : "bg-secondary"
                        }`}
                        style={{
                          width: "10px",
                          height: "10px",
                          padding: 0,
                          opacity: currentFeedbackIndex === index ? 1 : 0.4,
                          flex: "0 0 auto",
                        }}
                      ></button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                    onClick={handleNextFeedback}
                    aria-label="下一則回饋"
                    style={{
                      width: "44px",
                      height: "44px",
                      padding: 0,
                      flex: "0 0 auto",
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特色區 */}
      <div className="container my-7 overflow-hidden">
        <div className="d-flex flex-column flex-md-row gap-4">
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1661630495688-c0e75d70cdc6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="每日新鮮製作"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <h4 className="mt-4">每日新鮮製作</h4>
            <p className="text-muted mb-0" style={{ wordBreak: "break-word" }}>
              堅持手工製作，每一顆蛋糕都是當天新鮮完成。
            </p>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1700593946937-5b2a2eddbcd6?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="嚴選食材"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <h4 className="mt-4">嚴選食材</h4>
            <p className="text-muted mb-0" style={{ wordBreak: "break-word" }}>
              使用高品質原料，吃得安心又美味。
            </p>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1715793630134-279794a78483?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="用心包裝"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <h4 className="mt-4">用心包裝</h4>
            <p className="text-muted mb-0" style={{ wordBreak: "break-word" }}>
              送禮首選，讓每一份甜點都充滿心意。
            </p>
          </div>
        </div>
      </div>

      {/* CTA 區 */}
      <div className="bg-light py-7 overflow-hidden">
        <div className="container">
          <div className="d-flex justify-content-center">
            <div
              className="text-center"
              style={{
                width: "100%",
                maxWidth: "420px",
                minWidth: 0,
              }}
            >
              <h3 style={{ wordBreak: "break-word" }}>選一顆今天的幸福蛋糕</h3>
              <p
                className="text-muted mb-0"
                style={{ wordBreak: "break-word" }}
              >
                現在就挑選你喜歡的口味，讓甜點為生活加點幸福。
              </p>
              <div className="mt-4">
                <button
                  className="btn btn-dark rounded-0 px-4"
                  onClick={() => navigate("/product")}
                  style={{ maxWidth: "100%" }}
                >
                  顯示全部蛋糕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;