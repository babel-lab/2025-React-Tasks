import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  //從LOATION中取得資料, 渲染在畫面上
  //const location = useLocation();
  //const product = location.state?.productData;

  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    //取得單一商品資訊
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleView(id);
  }, [id]);

  //加入購物車
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return !product ? (
    <h2>重新查詢</h2>
  ) : (
    <div className="container mt-3">
      <div className="row">
        <h2>產品詳細頁</h2>
      </div>
      <div className="row">
        <div className="card col-md-12">
          <img
            src={product.imageUrl}
            width={300}
            height={300}
            className="card-img-top"
            alt="product.title"
          />
          <div className="card-body">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text">
              <span>價格: {product.price}</span>
              <span>
                <small className="text-body-secondary"> / {product.unit}</small>
              </span>
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                <span>原價: currency({product.origin_price})</span>
                <span className="mx-2"> | </span>
                <span>內容: {product.content}</span>
              </small>
            </p>
          </div>
          <div>
            {product.imagesUrl.map((url, index) => (
              <span key={index}>
                {
                  //渲染圖片
                  url && (
                    <img
                      key={index}
                      width={150}
                      height={150}
                      src={url}
                      alt={`副圖${index + 1}`}
                    />
                  )
                }
              </span>
            ))}
          </div>
          <div className="row my-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addCart(product.id)}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SingleProduct;
