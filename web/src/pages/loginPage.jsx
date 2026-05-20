const LoginPage = () => {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "GET",
        },
      );

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to get Google login URL");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 px-6 py-3 bg-white shadow-md rounded-lg hover:shadow-lg"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;