import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { currency } from "../../utilits/filter";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router";
import { createAsyncAddCart } from "../../slice/cartSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  // 產品列表
  const [products, setProducts] = useState([]);
  // 分類
  const [categories, setCategories] = useState([]);
  // 目前分類
  const [currentCategory, setCurrentCategory] = useState("all");

  const dispatch = useDispatch();

  // 用 REACT ROUTER 來做切換
  const navigate = useNavigate();

  // 分頁
  const [pagination, setPagination] = useState({
    current_page: 1,
    has_pre: false,
    has_next: false,
    total_pages: 1,
  });

  // 取得全部商品，拿來整理分類
  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      const result = [
        "all",
        ...new Set((response.data.products || []).map((p) => p.category)),
      ];
      setCategories(result);
    } catch (error) {
      console.log(error.response || error);
    }
  };

  // 取得商品列表
  const getProducts = async (page = 1, category = "all") => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`, {
        params: {
          page,
          category: category === "all" ? undefined : category,
        },
      });

      setProducts(response.data.products || []);
      setPagination(
        response.data.pagination || {
          current_page: 1,
          has_pre: false,
          has_next: false,
          total_pages: 1,
        },
      );
    } catch (error) {
      console.log(error.response || error);
    }
  };

  // 商品詳細頁
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

  // 初次載入抓分類
  useEffect(() => {
    getAllProducts();
  }, []);

  // 切換分類時，自動回第 1 頁
  useEffect(() => {
    getProducts(1, currentCategory);
  }, [currentCategory]);

  return (
    <>
      <style>{`
        .products-page {
          width: 100%;
          overflow-x: hidden;
        }

        .products-category-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 8px 12px;
          padding: 12px 16px;
        }

        .products-category-btn {
          border: 0;
          background: transparent;
          color: #6c757d;
          padding: 6px 8px;
          white-space: nowrap;
          line-height: 1.4;
        }

        .products-category-btn.active {
          color: #000;
          font-weight: 700;
        }

        .products-wrap {
          width: 100%;
          overflow-x: hidden;
        }

        .products-list {
          display: flex;
          flex-wrap: wrap;
          margin-left: -10px;
          margin-right: -10px;
        }

        .products-item {
          width: 100%;
          padding-left: 10px;
          padding-right: 10px;
          margin-bottom: 28px;
          flex: 0 0 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .products-card {
          height: 100%;
        }

        .products-img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }

        .products-title-link {
          text-decoration: none;
          color: inherit;
        }

        .products-desc {
          color: #6c757d;
          margin-bottom: 8px;
          word-break: break-word;
          line-height: 1.7;
        }

        .products-price {
          color: #6c757d;
          margin-bottom: 4px;
        }

        .products-category-text {
          color: #6c757d;
          margin-bottom: 0;
          word-break: break-word;
        }

        .products-btn-wrap {
          display: flex;
          gap: 8px;
          width: 100%;
          margin-top: 16px;
        }

        .products-btn {
          flex: 1;
          min-width: 0;
        }

        @media (min-width: 768px) {
          .products-item {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        @media (min-width: 992px) {
          .products-item {
            flex: 0 0 33.3333%;
            max-width: 33.3333%;
          }
        }
      `}</style>

      <div className="products-page">
        {/* 分類 */}
        <nav className="border border-start-0 border-end-0 border-top border-bottom">
          <div className="products-category-wrap">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`products-category-btn ${
                  currentCategory === category ? "active" : ""
                }`}
                onClick={() => setCurrentCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* 商品 */}
        <div className="container mt-md-5 mt-3 mb-7 products-wrap">
          <div className="products-list">
            {products.map((product) => (
              <div className="products-item" key={product.id}>
                <div className="card border-0 products-card">
                  <img
                    src={product.imageUrl}
                    className="products-img"
                    alt={product.title}
                  />

                  <div className="card-body p-0 d-flex flex-column h-100">
                    <h4 className="mt-3 mb-1" style={{ wordBreak: "break-word" }}>
                      <a
                        href="#"
                        onClick={(e) => handleViewDetail(e, product.id)}
                        className="products-title-link"
                      >
                        {product.title}
                      </a>
                    </h4>

                    <p className="products-desc">{product.description}</p>

                    <p className="products-price">
                      NT$ {currency(product.price)}
                    </p>

                    <p className="products-category-text small">
                      商品分類：{product.category}
                    </p>

                    <div className="products-btn-wrap mt-auto">
                      <button
                        type="button"
                        className="btn btn-outline-dark rounded-0 products-btn"
                        onClick={(e) => handleViewDetail(e, product.id)}
                      >
                        查看蛋糕
                      </button>

                      <button
                        type="button"
                        className="btn btn-dark rounded-0 products-btn"
                        onClick={() => handleAddCart(product.id, 1)}
                      >
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分頁 */}
          <div className="mt-4 mt-md-5">
            <Pagination
              pagination={pagination}
              onChangePage={(page) => getProducts(page, currentCategory)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;