import api from "./axios"


export const generateProductDescription = async (data) => { 
    const res = await api.post("/api/ai/generate-description", data)
    return res.data
 }
