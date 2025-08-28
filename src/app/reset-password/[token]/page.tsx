"use client";

import { useResetPasswordMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { closeLoginDialog, openLoginDialog} from "@/store/slice/userSlice";

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const page: React.FC = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setResetPasswordLoading(true);
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setResetPasswordLoading(false);
      return;
    }

    try {
      await resetPassword({
        token: token,
        newPassword: data.newPassword,
      }).unwrap();
      setResetPasswordSuccess(true);
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error("Password reset failed");
    } finally {
      setResetPasswordLoading(false);
    }
  };

   useEffect(() => {
    // ✅ force close login dialog every time this page loads
    dispatch(closeLoginDialog());
  }, [dispatch]);

  const handleLoginClick = () => {
    router.push('/');
    dispatch(openLoginDialog());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-purple-600 mb-6"
        >
          Reset Password
        </motion.h2>
        {!resetPasswordSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  {...register("newPassword", { required: true, minLength: 6 })}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="text-red-500 text-xs">
                  Password must be at least 6 characters.
                </span>
              )}
            </motion.div>
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", { required: true })}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                Please confirm your password.
              </span>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition"
                disabled={resetPasswordSuccess}
              >
                {resetPasswordLoading ? (
                  <Loader2 className="animate-spin mx-auto " size={20} />
                ) : (
                  "Reset Password"
                )}
              </button>
            </motion.div>
          </form>
        ) : (
            <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6 drop-shadow-lg" />
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Password Rset Successfully
            </h2>
            <p className="text-gray-600">
              Your password has been reset successfully . you can now log in
              with new Password
            </p>
            <Button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 mt-6 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              Go to Login
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default page;
