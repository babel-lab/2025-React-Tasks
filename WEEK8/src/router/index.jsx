import { createHashRouter } from "react-router-dom";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../views/frontend/Home";
import Products from "../views/frontend/Products";
import CheckoutSuccess from "../views/frontend/CheckoutSuccess";
import Checkout from "../views/frontend/Checkout";
import Cart from "../views/frontend/Cart";
import SingleProduct from "../views/frontend/SingleProduct";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      //註冊所有路由
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
  path: "checkout-success/:id",
  element: <CheckoutSuccess />,
},
    ],
  },
]);
