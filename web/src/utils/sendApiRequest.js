
import handleApiError from "./handleApiError"


/// centralize api request call 
const sendApiRequest = async(callback) => {
    try { 
        return await callback()
    } catch (error) {
        handleApiError(error)
        return null;
    }
}
export default sendApiRequest;
