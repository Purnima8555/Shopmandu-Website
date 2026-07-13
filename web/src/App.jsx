
import { useEffect } from "react";
import AppRoutes from "./routers/AppRoutes";
import useAuthStore from "./store/authStore";
import useProductStore from "./store/productStore";
import Loader from "./components/common/Loader";
import sendApiRequest from "./utils/sendApiRequest";


function App() {

  /// get user when user reload.
  const getMe = useAuthStore((state) => state.getMe);
  const {authChecked } = useAuthStore();
  const flashShale = useProductStore((state)=> state.flashShale)
  const getAllCategories = useProductStore(state=> state.getAllCategories)

 useEffect(() => {
    getMe();

    sendApiRequest(() =>
      flashShale({
        page: 1,
        limit: 10,
      })
    );

    sendApiRequest(() => getAllCategories());
  }, [getMe, flashShale, getAllCategories]);
  
    if(!authChecked){
    return <Loader  fullScreen={true}/>
  }

  return <AppRoutes/>;
}

export default App;
