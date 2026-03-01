import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useLocation, useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false);
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

      if (!token) {
        clearToken();
        setIsAuth(false);
        setLoading(false);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname, reason: "no_token" },
        });
        return;
      }

      axios.defaults.headers.common.Authorization = token;

      try {
        await axios.post(
          `${API_BASE}/api/user/check`,
          {},
          { headers: { Authorization: token } },
        );
        setIsAuth(true);
      } catch (error) {
        clearToken();
        setIsAuth(false);
        navigate("/login", {
          replace: true,
          state: { from: location.pathname, reason: "token_invalid" },
        });
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
        <RotatingLines color="grey" width={80} height={48} />
      </div>
    );
  }

  if (!isAuth) return null; // 已經導到 /login 了
  return children;
}

export default ProtectedRoute;
