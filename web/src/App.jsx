
import { useEffect } from "react";
import AppRoutes from "./routers/AppRoutes";
import useAuthStore from "./store/authStore";
import useProductStore from "./store/productStore";


function App() {

  /// get user when user reload.
  const getMe = useAuthStore((state) => state.getMe);
  const flashShale = useProductStore((state)=> state.flashShale)
  useEffect(() => {
    getMe();
    flashShale({
        page: 1,
        limit: 10,
      })
  }, [getMe, flashShale]);

  return <AppRoutes/>;
}

export default App;
