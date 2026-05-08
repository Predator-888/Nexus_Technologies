"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  amount: number;
  userData: any;
  onSuccess: (docsUrl: {offer: string, cert: string}) => void;
}

export default function Checkout({ amount, userData, onSuccess }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Load script
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Failed to create order");
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SmAYQV3IW8eLzK", // Hardcoded safely as it is a public test key, but usually from env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nexus Technologies",
        description: "Internship Registration Fee",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userData: userData
            })
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess({ offer: verifyData.offerLetterUrl, cert: verifyData.certificateUrl });
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phone || ""
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment Failed. Reason: " + response.error.description);
      });

    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full glass-panel p-8 rounded-2xl border border-gray-700"
    >
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Processing Fee</h3>
          <p className="text-sm text-gray-400">Offer Letter & Certificate</p>
        </div>
        <div className="text-3xl font-bold text-primary">
          ₹{amount}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Name</span>
          <span className="text-white font-medium">{userData?.name || "User"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Email</span>
          <span className="text-white font-medium truncate max-w-[200px]">{userData?.email || "email@example.com"}</span>
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-3 ${
          isProcessing ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#3399cc] hover:bg-[#2b88b8] text-white button-glow"
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            Pay with Razorpay
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        Secured by Razorpay
      </p>
    </motion.div>
  );
}
