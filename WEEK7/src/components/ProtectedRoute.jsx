import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useLocation, useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../slice/authSlice";

const API_BASE = import.meta.env.VITE_API_BASE;

function ProtectedRoute({ children }) {
  // ✅ Redux auth 狀態
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();

  // ✅ 只保留 loading 在 local state（這是 UI 狀態）
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // 登入確認
  const getToken = () =>
    document.cookie
      .split(";")
      .map((row) => row.trim())
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

  // 清除 token（登入失效時使用）
  const clearToken = () => {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common.Authorization;
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = getToken();

      // 1) 沒 token：直接導 login
      if (!token) {
        clearToken();
        dispatch(setAuth(false));
        setLoading(false);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname, reason: "no_token" },
        });
        return;
      }

      // 2) 有 token：丟給 axios + call check
      axios.defaults.headers.common.Authorization = token;

      try {
        await axios.post(
          `${API_BASE}/api/user/check`,
          {},
          { headers: { Authorization: token } },
        );

        // ✅ 驗證成功
        dispatch(setAuth(true));
      } catch (error) {
        // ✅ 驗證失敗：清掉 cookie + redux
        clearToken();
        dispatch(setAuth(false));
        navigate("/login", {
          replace: true,
          state: { from: location.pathname, reason: "token_invalid" },
        });
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [dispatch, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
        <RotatingLines color="grey" width={80} height={48} />
      </div>
    );
  }

  // 已經導到 /login 了
  if (!isAuth) return null;

  return children;
}

export default ProtectedRoute;
