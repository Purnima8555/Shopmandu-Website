

import AccountSetting from './AccountSetting';
import AddProduct from './AddProduct';
import DashbordHome from './DashbordHome';
import ListAllProducts from './ListAllProducts';
import ShopProfile from './ShopProfile';

const TabRander = ({currentTab, setCurrentTab}) => {

                 const onBack=() => {
              setCurrentTab('all-products');
            }

    console.log(currentTab)
    switch(currentTab){
        case 'dashboard':
        return(
            <DashbordHome  />
        );

        case 'shop-profile': 
        return(
            <ShopProfile />
        );

        case 'all-products': 
        return(
            <ListAllProducts setCurrentTab={setCurrentTab} />
        );

        case 'add-product': 
        return(
            <AddProduct onBack={onBack} />
        );
        case 'settings':
            return (
                <AccountSetting />
            )


        default:
        return (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-[#1F2937]">Feature Coming Soon</h3>
            <p className="text-xs text-[#64748B] mt-1">This segment is currently in development.</p>
          </div>
        );  
    }
}

export default TabRander