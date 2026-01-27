import { useState } from "react";

import axios from "axios";

import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState();

  //輸入變更時, 儲存帳號/密碼
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //取產品列表
  const getProducts = async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
      );
      // const response = await axios.get(
      //   `${API_BASE}/api/${API_PATH}/admin/products`,
      //   { headers: { Authorization: token } },
      // );
      // console.log("UR:" + `${API_BASE}/api/${API_PATH}/admin/products`, {
      //   headers: { Authorization: token },
      // });
      console.log("response:" + response);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response);
    }
  };

  //登入
  const onSubmit = async (e) => {
    {
      JSON.stringify("API_BASE:" + API_BASE);
    }
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(response.data);

      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired).toUTCString()};path=/`;
      //axios.defaults.headers.common["Authorization"] = token;
      axios.defaults.headers.common.Authorization = token;
      console.log("check token =", token);

      setIsAuth(true);
      getProducts();
      console.log("cookie now =", document.cookie);
    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  };

  //登入確認

  const getToken = () =>
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

  const checkLogin = async () => {
    // const token = document.cookie
    //   .split(";")
    //   .find((row) => row.startsWith("hexToken="))
    //   ?.split("=")[1];

    const token = getToken();

    console.log("[check] token =", token);
    if (!token) {
      console.log("[check] 沒拿到 token");
      return;
    }
    try {
      //axios.defaults.headers.common["Authorization"] = token;

      // const response = await axios.post(
      //   `${API_BASE}/api/user/check`,
      //   {},
      //   { headers: { Authorization: token } },
      // );

      const response = await axios.post(
        "https://ec-course-api.hexschool.io/v2/api/user/check",
        {},
        { headers: { Authorization: token } },
      );

      console.log(response.data);
      console.log("[check] ok", response.data);
      console.log("登入確認成功");
      //console.log("check token =", token);
    } catch (error) {
      console.log(error.response?.data.message);
      console.log("[check] axios err =", error);
      console.log("[check] message =", error?.message);
      console.log("[check] code =", error?.code);
      console.log("[check] response =", error?.response);
      console.log("[check] status =", error?.response?.status);
      console.log("[check] data =", error?.response?.data);
      console.log("登入確認錯誤");
    }
  };

  //網頁顯示內容
  return (
    <>
      {!isAuth ? (
        <div className="container login">
          <h1>請先登入</h1>
          <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating ">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2">
              登入
            </button>
          </form>
        </div>
      ) : (
        <div className="container">
          <button
            type="button"
            className="btn btn-danger mb-5 mt-4"
            onClick={() => checkLogin()}
          >
            確認是否登入
          </button>
          <div className="row mt-2">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setTempProduct(product)}
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-4">
              <h2>產品明細</h2>
              {tempProduct ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    alt="主圖"
                    style={{ height: "300px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{tempProduct.title}</h5>
                    <p className="card-text">商品描述：{tempProduct.content}</p>
                    <div className="d-flex">
                      <del className="text-secondary">
                        {tempProduct.origin_price}
                      </del>{" "}
                      元/{tempProduct.price} 元
                    </div>
                    <h5 className="card-title">更多圖片</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="副圖"
                          style={{ height: "100px", marginRight: "5px" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>請選擇商品</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
