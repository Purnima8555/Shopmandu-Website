

import axios from "axios";
import { dismissToast, showError } from "./toast";

/// for error handle
const handleApiError = (error) => {

    if (!axios.isAxiosError(error)) {
        dismissToast();
        showError("something went wrong.");
        return
    }
    const status = error.response.status;
    const data = error.response.data

    // console.error("Error Data is : ",data)

    /// if alrady have message then show toast with that message.
    if (data?.message) {
        dismissToast();
        showError(data.message)
        return
    }
    switch (status) {
        case 400:
            dismissToast();
            showError("Bad request.");
            break;

        case 401:
            dismissToast();
            showError("Please login again.");
            break;

        case 403:
            dismissToast();
            showError("You don't have permission.");
            break;

        case 404:
            dismissToast();
            showError("Resource not found.");
            break;

        case 500:
            dismissToast();
            showError("Internal server error.");
            break;

        default:
            showError("Something went wrong.");
    }

}

export default handleApiError;