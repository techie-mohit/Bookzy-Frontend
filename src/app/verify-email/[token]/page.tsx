"use client";

import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const page: React.FC = () => {
  const { token } = useParams();

  const router = useRouter();

  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();

  const isVerifyEmail = useSelector(
    (state: RootState) => state.user.isEmailVerified
  );
  console.log("isVerifyEmail", isVerifyEmail);

  const [verificationStatus, setVerificationStatus] = React.useState<
    "loading" | "success" | "alreadyVerified" | "failed"
  >("loading");

  useEffect(() => {
    const verify = async () => {
      if (isVerifyEmail) {
        setVerificationStatus("alreadyVerified");
        return;
      } else {
        try {
          const result = await verifyEmail(token).unwrap();
          console.log("result", result);
          if (result.success) {
            dispatch(setEmailVerified(true));
            setVerificationStatus("success");
            dispatch(authStatus());
            toast.success("Email verified successfully");
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          } else {
            throw new Error(result.message || "verification failed");
          }
        } catch (error) {
          console.log("Error verifying email:", error);
        }
      }
    };

    if (token) {
      verify();
    }
  }, [isVerifyEmail, token, verifyEmail, dispatch]);

  return (
   <div className="p-6 flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 min-h-screen">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-lg rounded-2xl shadow-xl backdrop-blur-xl bg-white/70 border border-white/30 p-10 text-center"
  >
    {/* LOADING */}
    {verificationStatus === "loading" && (
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Verifying Your Email
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your email address...
        </p>
      </div>
    )}

    {/* SUCCESS */}
    {verificationStatus === "success" && (
      <div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6 drop-shadow-lg" />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Email Verified 🎉
        </h2>
        <p className="text-gray-600">
          Your email has been successfully verified. Redirecting you shortly...
        </p>
      </div>
    )}

    {/* ALREADY VERIFIED */}
    {verificationStatus === "alreadyVerified" && (
      <div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6 drop-shadow-lg" />
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Already Verified
        </h2>
        <p className="text-gray-600">
          Your email has already been verified. You can use our services freely.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 mt-6 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          Go to Homepage
        </Button>
      </div>
    )}
  </motion.div>
</div>

  );
};

export default page;
