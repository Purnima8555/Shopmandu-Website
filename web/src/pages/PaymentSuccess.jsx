import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    const verify = async () => {
      await axios.get(
        `http://localhost:3000/api/payment/stripe/verify?sessionId=${sessionId}`,
        { withCredentials: true }
      );
    };

    if (sessionId) verify();
  }, [sessionId]);

  return <h1>Payment Successful 🎉</h1>;
}