import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginPage = () => {
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
        const res = await axios.post(
            "http://localhost:3000/api/users/google-login",
            {
            idToken: credentialResponse.credential,
            },
        );

        console.log("BACKEND RESPONSE:", res.data);

        // Store JWT token
        localStorage.setItem("token", res.data.token);
        alert("Google Login Successful!");
        } catch (error) {
        console.log(error);
        alert("Google Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">
            <h1 className="text-3xl font-bold text-center mb-2">
            Welcome to ShopMandu
            </h1>
            <p className="text-gray-500 text-center mb-8">Continue with Google</p>
            <div className="flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                alert("Google Login Failed");
                }}
            />
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
