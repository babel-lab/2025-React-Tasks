import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  /*
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
*/

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "yu-class@gmail.com",
      password: "",
    },
  });

  //輸入變更時, 儲存帳號/密碼
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //登入
  const onSubmit = async (formData) => {
    {
      JSON.stringify("API_BASE:" + API_BASE);
    }
    // ❌ react-hook-form 已經幫你 preventDefault，不需要再寫
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(response.data);

      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired).toUTCString()};path=/`;
      axios.defaults.headers.common.Authorization = token;
      //console.log("check token =", token);

      //setIsAuth(true);
      //getProducts();
      //console.log("cookie now =", document.cookie);
    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  };

  return (
    <div className="container login">
      <h1>請先登入</h1>

      {/* ✅ 一定要把 onSubmit 傳進 handleSubmit */}
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            //value={formData.username}
            //onChange={(e) => handleInputChange(e)}
            required
            {...register("username", {
              required: "請輸入 Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email 格式不正確",
              },
            })}
          />

          <label htmlFor="username">Email address</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>

        <div className="form-floating ">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            //value={formData.password}
            //onChange={(e) => handleInputChange(e)}
            autoComplete="current-password"
            required
            {...register("password", {
              required: "請輸入密碼",
              minLength: { value: 6, message: "密碼最少 6 碼" },
            })}
          />
          <label htmlFor="password">Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-2">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
