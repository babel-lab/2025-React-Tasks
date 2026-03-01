import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { setAuth } from "../slice/authSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  /*
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  */

  // ✅ 顯示 API 錯誤用
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //登入, 路由切換後到後台
  const navigate = useNavigate();

  //REDUX 登入登出狀態管理
  const dispatch = useDispatch();

  /* ===============================
     取得 cookie token
  =============================== */
  const getToken = () =>
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

  /* ===============================
     進 Login 頁時先檢查
     - 若已登入, 直接導去後台產品頁
  =============================== */
  const checkLogin = async () => {
    const token = getToken();

    //沒 token, 代表尚未登入
    if (!token) return;

    //先把 token 設給 axios
    axios.defaults.headers.common.Authorization = token;

    try {
      await axios.post(
        `${API_BASE}/api/user/check`,
        {},
        { headers: { Authorization: token } },
      );

      //登入仍有效
      //setIsAuth?.(true);
      dispatch(setAuth(true));

      //直接導去後台產品頁
      navigate("/admin/product", { replace: true });
    } catch (error) {
      //token 過期或錯誤, 清除 cookie
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      //setIsAuth?.(false);
      dispatch(setAuth(false));
    }
  };

  //一進 Login 頁就檢查是否已登入
  useEffect(() => {
    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // ✅ 使用者一改輸入，就把 API 錯誤清掉（避免一直卡紅字）
  const username = watch("username");
  const password = watch("password");
  useEffect(() => {
    if (apiError) setApiError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  //輸入變更時, 儲存帳號/密碼（目前未使用 react-hook-form 時才需要）
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    /*
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
    */
  };

  //登入
  const onSubmit = async (formData) => {
    setSubmitting(true);
    setApiError("");

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);

      const { token, expired } = response.data;

      //寫入 cookie
      document.cookie = `hexToken=${token};expires=${new Date(
        expired,
      ).toUTCString()};path=/`;

      //設定 axios 預設 header
      axios.defaults.headers.common.Authorization = token;

      setIsAuth?.(true);

      //登入成功後導頁
      navigate("/admin/product", { replace: true });
    } catch (error) {
      setIsAuth?.(false);

      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      let userMessage = "登入失敗，請稍後再試";

      // ✅ 你想要「錯帳密」更清楚：400 直接改成固定文案
      if (status === 400) {
        userMessage = "帳號或密碼錯誤，請重新輸入";
      } else if (status === 401) {
        userMessage = "登入驗證失敗，請重新登入";
      } else if (!error?.response) {
        userMessage = "無法連線到伺服器，請檢查網路";
      } else if (serverMessage) {
        // ✅ 其他狀況才用後端訊息（例如 500、403…）
        userMessage = serverMessage;
      }

      setApiError(userMessage);
      console.log("login error:", error.response || error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     登入中 Loading（置中於 Header 下方）
  =============================== */
  if (submitting) {
    return (
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <RotatingLines color="grey" width={80} height={48} />
      </div>
    );
  }

  return (
    <div className="container login">
      <h1>請先登入</h1>

      {/* ✅ API 錯誤訊息顯示區 */}
      {apiError && (
        <div className="alert alert-danger" role="alert">
          {apiError}
        </div>
      )}

      {/* ✅ 一定要把 onSubmit 傳進 handleSubmit */}
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            id="username"
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            //value={formData.username}
            //onChange={(e) => handleInputChange(e)}
            autoComplete="username"
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

        <div className="form-floating">
          <input
            id="password"
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

        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={submitting}
        >
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
