import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { currency } from "../../utils/filter";
import { RotatingLines } from "react-loader-spinner";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  //加入購物車訊息
  const [message, setMessage] = useState("");
  //是否還在載入商品資料
  const [loading, setLoading] = useState(true);
  // 2 秒後才允許顯示「沒有商品」
  const [showEmpty, setShowEmpty] = useState(false);

  const [products, setProducts] = useState([]);
  //react router
  const navigate = useNavigate();
  /*
  useEffect(() => {
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
  }, []);
  */
  useEffect(() => {
    // 2 秒後才允許顯示「沒有商品」
    const emptyTimer = setTimeout(() => {
      setShowEmpty(true);
    }, 2000);

    const getProducts = async () => {
      try {
        console.log("API:", `${API_BASE}/api/${API_PATH}/products`);
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.log(error?.response || error);
        setProducts([]); // 失敗就當作沒商品
      } finally {
        setLoading(false); // ✅ 不管成功失敗都結束 loading
      }
    };

    getProducts();

    return () => clearTimeout(emptyTimer);
  }, []);

  //取得單一商品資訊
  const handleView = async (id) => {
    /*
try{
const response = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
console.log(response.data.product);
//打完API, 切換頁面. 把接到的資料傳到下一個詳細頁面
navigate(`/product/${id}`,{state:{productData: response.data.product}});
}catch(error){
    console.log(error.response);
}
   */
    //只切頁面
    navigate(`/product/${id}`);
  };

  //商品直接加入購物車
  // 加入購物車: POST ${API_BASE}/api/${API_PATH}/cart
  const addToCart = async (product, qty = 1) => {
    try {
      const data = {
        product_id: product.id,
        qty,
      };

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });

      console.log("加入購物車成功:", response.data);

      // 顯示提示訊息
      setMessage(`「${product.title}」已加入購物車`);

      // 2 秒後自動消失
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="contaner ">
      {message && (
        <div className="alert alert-warning text-center">{message}</div>
      )}
      {!loading && products.length === 0 && showEmpty && (
        <div className="row">
          <h2>沒有商品</h2>
        </div>
      )}
      <div className="row">
        <h2>產品列表</h2>
      </div>
      {loading && (
        <div className="row">
          <div className="d-flex flex-column align-items-center py-4">
            <RotatingLines color="grey" width={80} height={48} />
            <div className="text-body-secondary mt-2">載入中...</div>
          </div>
        </div>
      )}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card">
              <img
                src={product.imageUrl}
                width={200}
                height={200}
                className="card-img-top"
                alt="product.title"
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <span>價格: {currency(product.price)}</span>
                  <span>
                    <small className="text-body-secondary">
                      {" "}
                      / {product.unit}
                    </small>
                  </span>
                </p>
                <div className="d-flex gap-2 justify-content-around">
                  <button
                    type="button"
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleView(product.id)}
                  >
                    查看更多
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1"
                    onClick={() => addToCart(product)}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
