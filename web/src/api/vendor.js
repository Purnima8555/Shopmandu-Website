import api from "./axios"



export const updateVendorName = async (param) => { 


        // console.log(param)
        const updatedVendor = await api.patch("/api/vendor/update-name", param)
        // console.log(updatedVendor)
        return updatedVendor?.data        

 }


 export const updateProfile = async (param) => {
   
        // console.log(param)
        const updatedVendor = await api.patch("/api/vendor/update-avatar", param)
        // console.log(updatedVendor)
        return updatedVendor?.data        
  

 }
