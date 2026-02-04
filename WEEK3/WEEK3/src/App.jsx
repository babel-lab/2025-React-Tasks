import { useState, useEffect, useRef } from "react";

import axios from "axios";

import * as bootstrap from "bootstrap";

import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [], //陣列要特殊處理
};

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");

  const productModalRef = useRef(null);

  //輸入變更時, 儲存帳號/密碼
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //產品資料改變
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    setTemplateProduct((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleModalImageChange = (index, value) => {
    //設定新的值
    setTemplateProduct((pre)=>{
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

//UX優化: 填寫最後一個空輸入框時, 自動新增空白輸入框
if(value !=="" && index === newImage.length -1 && newImage.length < 5){newImage.push('');}

//UX優化: 清空輸入框時, 移除最後的空白輸入框
if(value === "" && newImage.length > 1 && newImage[newImage.length-1] === ""){newImage.pop()}

      return {
        ...pre,
        imagesUrl: newImage
      } 
    } )
  }

  //新增最後一筆產品圖片
const handleAddImage = () => {
  setTemplateProduct((pre) => {
    const newImage = [...pre.imagesUrl];
    newImage.push("");
    return {
      ...pre,
      imagesUrl: newImage,
    };  
  });
}
  //移除最後一筆產品圖片
  const handleRemoveImage = () => { 
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop("");
      return {
        ...pre,
        imagesUrl: newImage,
      };  
    });  
  }




  //取產品列表
  const getProducts = async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`,
      );
      console.log("response:" + response);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response);
    }
  };

  //更新產品
  //建立URL取得變數
  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = 'post'
    if(modalType==='edit'){
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      method = 'put'
    }
  
  const productData={
    data:{
      ...templateProduct,
      origin_price: Number(templateProduct.origin_price),
      price: Number(templateProduct.price),
      is_enabled: templateProduct.is_enabled ? 1 : 0,
      imagesUrl: [...templateProduct.imagesUrl.filter((url)=>url!=="")],
    }
  }
  try{
      const response = await axios[method](url,productData);
      console.log(response.data);
      getProducts();
      closeModal();
      console.log('close modal');
      
    }catch(error){
      console.log(error.response);
    }
  }


  //刪除產品
  const delProduct = async(id) => {
try{
  console.log('id:'+id);
  const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
  console.log(response.data);
  //如果成功了, 就要更新產品資訊
  getProducts();
  closeModal();
}catch(error){
  console.log(error.response);  
  }
}
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
    const token = getToken();

    console.log("[check] token =", token);
    if (!token) {
      console.log("[check] 沒拿到 token");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE}/api/user/check`,
        {},
        { headers: { Authorization: token } },
      );

      console.log(response.data);
      console.log("[check] ok", response.data);
      console.log("登入確認成功");

      //TASK3: 取得產品列表頁
      getProducts();
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

  //TASK3
  useEffect(() => {
    checkLogin();

    //畫面完成後才做綁定
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, []);

  // Modal 關閉時移除焦點
  /*
  document
    .querySelector("#productModal")
    .addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
*/
  //已經選到DOM元素了
  //開啟
  const openModal = (type, product) => {

    console.log(product);
    setModalType(type);
    //把產品設定進去MODAL
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));

    productModalRef.current.show();
  };
  //隱藏
  const closeModal = () => {
    productModalRef.current.hide();
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
          <h2>產品列表</h2>
          <div className="text-end mt-4 y-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>

          <table className="table align-middle">
            <thead>
              <tr>
              <th scope="col">預覽</th>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th width="100">單位</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
                <th>其他副圖</th> {/* 新增這一欄 */}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
{/* 新增主圖預覽欄位 */}
<td>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
          className="img-thumbnail" 
          style={{ 
    width: '60px',       // 從 100px 調降
    height: '60px',      // 保持 1:1 比例
    objectFit: 'cover'   // 務必保留這行，確保縮小時圖片不變形
  }}
        />
      </td>
                  <td>{product.category}</td>
                  <th scope="row">{product.title}</th>
                  {/* 新增單位欄位 */}
      <td>{product.unit}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td className={`${product.is_enabled && "text-success"}`}>
                    {product.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm" 
                        onClick={()=>openModal("delete", product) }
                      >
                        刪除
                      </button>
                      
                    </div>
                  </td>


{/* 新增副圖列表 */}
      <td>
        <div className="d-flex flex-wrap gap-2">
          {product.imagesUrl && product.imagesUrl.map((url, index) => (
            url ? (
              <img 
                key={index}
                src={url} 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                className="img-thumbnail" 
                alt={`副圖 ${index + 1}`} 
              />
            ) : null
          ))}
          {(!product.imagesUrl || product.imagesUrl.filter(url => url).length === 0) && (
            <span className="text-muted small"></span>
          )}
        </div>
      </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={productModalRef}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className={`modal-header bg-${modalType==='delete'?'danger':'dark'} text-white`}>
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalType==='delete'?'刪除': modalType==='edit'?'編輯':'新增'}產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
{
  modalType==='delete' ? (
    <p className="fs-4">
	  確定要刪除
	  <span className="text-danger">{templateProduct.title}</span>嗎？
	</p>

  ):(<div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={templateProduct.imageUrl}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>

                    {
                      //確定是否有圖
                      templateProduct.imageUrl && (
                        <img
                          className="img-fluid"
                          src={templateProduct.imageUrl}
                          alt="主圖"
                        />
                      )
                    }
                  </div>
                  <div>
                    {templateProduct.imagesUrl.map((url, index) => (
                      <div key={index}>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`圖片網址${index + 1}`}
                          value={url}
                          onChange={(e)=>handleModalImageChange(index, e.target.value)}
                        />
                        {
                          //渲染圖片
                          url && (
                            <img
                              className="img-fluid"
                              src={url}
                              alt={`副圖${index + 1}`}
                            />
                          )
                        }
                      </div>
                    ))}

{
  templateProduct.imagesUrl.length < 5 && templateProduct.imageUrl[templateProduct.imagesUrl.length -1] !== "" &&

<button className="btn btn-outline-primary btn-sm d-block w-100" 
                    onClick={()=>handleAddImage()}>
                      新增圖片
                    </button>

}           
                  </div>
                  <div>
{
  templateProduct.imagesUrl.length >= 1 && 
  <button className="btn btn-outline-danger btn-sm d-block w-100" 
                    onClick={()=>handleRemoveImage()}>
                      刪除圖片
                    </button>
}

                    
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateProduct.title}
                      onChange={(e)=>handleModalInputChange(e)}
                      disabled ={modalType==='edit'}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={templateProduct.category}
                        onChange={(e)=>handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={templateProduct.unit}
                        onChange={(e)=>handleModalInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateProduct.origin_price}
                        onChange={(e)=>handleModalInputChange(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateProduct.price}
                        onChange={(e)=>handleModalInputChange(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateProduct.description}
                      onChange={(e)=>handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={templateProduct.content}
                      onChange={(e)=>handleModalInputChange(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={templateProduct.is_enabled}
                        onChange={(e)=>handleModalInputChange(e)}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>)
}

              
            </div>
            <div className="modal-footer">
{
  modalType==='delete' ?(<button
    type="button"
    className="btn btn-danger" 
    onClick={()=>delProduct(templateProduct.id)}
  >
    刪除
  </button>):(
<> 
<button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={() => closeModal()}
              >
                取消
              </button>
              <button type="button" className="btn btn-primary" 
              onClick={()=>updateProduct(templateProduct.id)}>
                確認
              </button>
 </>
  )
}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
