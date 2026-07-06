import { useState } from 'react';
import { Plus, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import ProfileMenuButton from '../ui/ProfileMenuButton';
import useShopStore from '../../../store/shop';
import useAuthStore from '../../../store/authStore';


export default function Header({ onAddProductClick, searchQuery,setSearchQuery,onNavigateToTab}) {

  
    const {loading} = useShopStore()
    const {shop} = useShopStore()
    const {user} = useAuthStore()
    // console.log("My shop is : ",user)
    // console.log(loading)


    
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header id="top-navigation" className="sticky top-0 right-0 z-20 w-full h-16 bg-white border-b border-[#DBE4EC] flex items-center justify-between px-6 shadow-sm">
      {/* left Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <SearchInput iconPosition="right" disabled={loading} onChange={e=>setSearchQuery(e.target.value)} placeholder={"Search Products, Orders, Customer..."} value={searchQuery}  />
        </div>
      </div>

      {/* right section. */}
      <div className="flex items-center gap-4">
        {/* Add Product Button */}
        <Button icon={Plus} iconPosition='left' iconsize={18}  className='cursor-pointer hidden sm:block sm:py-2 sm:px-2' onClick={onAddProductClick} >Add Product</Button>

    
        {/* Vertical Separator */}
        <div className="h-6 w-[1px] bg-border"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown)}}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-bg-surface rounded-[10px] transition-all text-left"
          >
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="w-8 h-8 rounded-lg object-cover border border-border"
            />
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-text-primary leading-tight">{user.userName}</span>
              <span className="text-[10px] text-text-secondary leading-tight">{shop.shopName}</span>
            </div>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-bg-card rounded-[14px] shadow-xl border border-border py-2 z-50">
              <div className="px-4 py-3 border-b border-border md:hidden">
                <p className="text-sm font-semibold text-text-primary">{user.userName}</p>
                <p className="text-xs text-text-secondary truncate">{shop.shopName}</p>
              </div>
            <ProfileMenuButton icon={User} title='Shop Profile' onClick={() => {onNavigateToTab('shop-profile');setShowProfileDropdown(false)}} />
            <ProfileMenuButton icon={SettingsIcon} title='Account Settings' onClick={() => {onNavigateToTab('settings');setShowProfileDropdown(false)}}/>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={() =>{ alert('Log out. '); setShowProfileDropdown(false)}}
                className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 transition-all flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


