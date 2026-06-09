import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import PaymentSuccess from "./pages/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/cart",
    element: <CartPage />,
  },

  {
    path: "/payment-success",
    element: <PaymentSuccess/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;