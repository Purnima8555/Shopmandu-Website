import { useEffect } from "react";
import AppRoutes from "./routers/AppRoutes";
import useAuthStore from "./store/authStore";
import useProductStore from "./store/productStore";
import Loader from "./components/common/Loader";
import sendApiRequest from "./utils/sendApiRequest";
import useWishlistStore from "./store/wishlistStore";
import useCartStore from "./store/cartStore";

function App() {
  /// get user when user reload.
  const getMe = useAuthStore((state) => state.getMe);
  const { authChecked, user } = useAuthStore();
  const flashShale = useProductStore((state) => state.flashShale);
  const getAllCategories = useProductStore((state) => state.getAllCategories);
  const getWishlist = useWishlistStore((state) => state.getWishlist);
  const getCart = useCartStore((state) => state.getCart);

  useEffect(() => {
    sendApiRequest(() => getMe());

    sendApiRequest(() =>
      flashShale({
        page: 1,
        limit: 10,
      }),
    );

    sendApiRequest(() => getAllCategories());
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    const isUser = user?.roles?.includes("USER");

    if (!isUser) return;

    sendApiRequest(() => getWishlist());
    sendApiRequest(() => getCart());
  }, [authChecked, user]);

  if (!authChecked) {
    return <Loader fullScreen={true} />;
  }

  return <AppRoutes />;
}

export default App;
