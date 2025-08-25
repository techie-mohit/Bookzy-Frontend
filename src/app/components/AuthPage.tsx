import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from "@/store/api";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

interface ForgotPasswordFormData {
  email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {


  const [currentTab, setCurrentTab] = React.useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] =
    React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [signupLoading, setSignupLoading] = React.useState(false);
  const [forgotLoading, setForgotLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const [register] = useRegisterMutation();
  const [login]  = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const dispatch = useDispatch();

  const {
    register: registerLogin, handleSubmit: handleLoginSubmit,  formState: { errors: loginErrors }} = useForm<LoginFormData>();
  const {
    register: registerSignup, handleSubmit: handleSignupSubmit,  formState: { errors: signupErrors }} = useForm<SignupFormData>();
  const {
    register: registerForgot,  handleSubmit: handleForgotSubmit,  formState: { errors: forgotErrors }} = useForm<ForgotPasswordFormData>();

  const onSubmitSignUp = async(data: SignupFormData)=>{
    setSignupLoading(true);
    try {
      const {email, password, name} = data;
      const result = await register({email, password, name}).unwrap();
      console.log("Registration successful:", result);
      if(result.success){
        toast.success("verification link send to your email successfully. please verify your email");
        dispatch(toggleLoginDialog());
      }      
    } catch (error) {
      toast.error("Registration failed. Please try again. Email Already registered");
    }
    finally{
      setSignupLoading(false);
    }
  }

  const onSubmitLogin = async(data: LoginFormData)=>{
    setLoginLoading(true);
    try {
      const {email, password} = data;
      const result = await login({email, password}).unwrap();
      console.log("Login  successful:", result);
      if(result.success){
        toast.success("Login successful");
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
        window.location.reload();
      }      
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Email or password is incorrect");
    }
    finally{
      setLoginLoading(false);
    }
  }
  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            Welcome to Book Kart
          </DialogTitle>
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as "login" | "signup" | "forgot")
            }
          >
            <TabsList className="grid w-full grid-cols-3 mb-6 gap-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">
                    <div className="relative">
                      <Input
                        className="pl-12"
                        type="email"
                        placeholder="Email"
                        {...registerLogin("email", {
                          required: "Email is required",
                        })}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {loginErrors.email && (
                      <p className="text-red-500 text-sm">
                        {loginErrors.email.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        className="pl-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...registerLogin("password", {
                          required: "Password is required",
                        })}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm">
                        {loginErrors.password.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className=" w-full  flex justify-center items-center font-bold"
                    >
                      {loginLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 h-4 w-4"
                            size={20}
                          />
                          Loading ...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="flex items-center my-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <p className="mx-2 text-gray-500 text-sm"> Or </p>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <Button className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
                      {googleLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 h-4 w-4"
                            size={20}
                          />
                          Login with Google...
                        </>
                      ) : (
                        <>
                          <Image
                            src="/icons/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                          />
                          Google
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignupSubmit(onSubmitSignUp)} className="space-y-4">
                    <div className="relative">
                      <Input
                        className="pl-12"
                        type="text"
                        placeholder="Name"
                        {...registerSignup("name", {
                          required: "Name is required",
                        })}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {signupErrors.name && (
                      <p className="text-red-500 text-sm">
                        {signupErrors.name.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        className="pl-12"
                        type="email"
                        placeholder="Email"
                        {...registerSignup("email", {
                          required: "Email is required",
                        })}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {signupErrors.email && (
                      <p className="text-red-500 text-sm">
                        {signupErrors.email.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        className="pl-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...registerSignup("password", {
                          required: "Password is required",
                        })}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {signupErrors.password && (
                      <p className="text-red-500 text-sm">
                        {signupErrors.password.message}
                      </p>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        {...registerSignup("agreeTerms", {
                          required: "You must agree to the terms",
                        })}
                        className="h-4 w-4   "
                      />
                      <label
                        htmlFor="agreeTerms"
                        className="ml-3 text-sm text-gray-600"
                      >
                        I agree to the terms and conditions
                      </label>
                    </div>
                    {signupErrors.agreeTerms && (
                      <p className="text-red-500 text-sm">
                        {signupErrors.agreeTerms.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className=" w-full  flex justify-center items-center font-bold"
                    >
                      {signupLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 h-4 w-4"
                            size={20}
                          />
                          Loading ...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="forgot" className="space-y-4">
                  {
                    !forgotPasswordSuccess ? (
                      <form className="space-y-4">
                    <div className="relative">
                      <Input
                        className="pl-12"
                        type="email"
                        placeholder="Email"
                        {...registerForgot("email", {
                          required: "Email is required",
                        })}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    {forgotErrors.email && (
                      <p className="text-red-500 text-sm">
                        {forgotErrors.email.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className=" w-full  flex justify-center items-center font-bold"
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2
                            className="animate-spin mr-2 h-4 w-4"
                            size={20}
                          />
                          Loading ...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                    ):(
                      <motion.div
                        className="text-center space-y-4"
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1 }}
                        >
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto"/>
                          <h3 className="text-xl font-semibold text-gray-700">Reset Link Sent</h3>
                          <p className="text-gray-500">We have sent a password reset link to your email address. Please check your email for the reset link.</p>

                          <Button
                            onClick={() => {
                              setForgotPasswordSuccess(false);
                            }}
                            className="w-full flex justify-center items-center font-bold"
                            >Send Another Link To Email</Button>
                        </motion.div>
                    )
                  }
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <p className="mt-2 text-sm text-center text-gray-600">
            By Clicking "agree", you agree to our{" "}
            <Link href="/terms-of-use" className="text-blue-500 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-blue-500 underline">
              Privacy Policy
            </Link>
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPage;
