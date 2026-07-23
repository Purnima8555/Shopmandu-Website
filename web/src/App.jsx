import { useEffect } from "react";
import AppRoutes from "./routers/AppRoutes";


import Loader from "./components/common/Loader";
import sendApiRequest from "./utils/sendApiRequest";


import useWishlistStore from "./features/wishlist/store/wishlist.store";
import useCartStore from "./features/cart/store/cart.store";
import useProductStore from "./features/product/store/product.store";
import useAuthStore from "./features/auth/store/auth.store";
import useCategoryStore from "./features/product/store/category.store";
import Roles from "./constants/roleBase";

function App() {
  /// get user when user reload.
  const getMe = useAuthStore((state) => state.getMe);
  const authChecked = useAuthStore((state)=> state.authChecked)
  const user = useAuthStore((state)=>state.user)
  const flashShale = useProductStore((state) => state.flashShale);
  const getAllCategories = useCategoryStore((state) => state.getAllCategories);
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

    // console.log(user, token)
    sendApiRequest(() => getAllCategories());
  }, [getAllCategories, flashShale, getMe]);

  useEffect(() => {
    if (!authChecked) return;

    const isUser = user?.roles?.includes(Roles.USER_ROLE);

    if (!isUser) return;

    sendApiRequest(() => getWishlist());
    sendApiRequest(() => getCart());
  }, [authChecked, user, getWishlist, getCart]);

  if (!authChecked) {
    return <Loader fullScreen={true} />;
  }

  return <AppRoutes />;
}

export default App;
