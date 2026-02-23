import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";
import BookLoader from "@/lib/BookLoader";

export default function AuthCheck({children}:{children: React.ReactNode}){
    const [verifyAuth, {isLoading}] = useVerifyAuthMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const dispatch = useDispatch();

    const user = useSelector((state:RootState)=> state.user.user );
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    useEffect(()=>{
        const checkAuth = async()=>{
            try {
                const response = await verifyAuth({}).unwrap();
                console.log("Auth verification response:", response);
                if(response.success){
                    console.log("User is authenticated:", response.data);
                    dispatch(setUser(response.data));
                    dispatch(setEmailVerified(response.data.isVerified));
                }
                else{
                    console.log("User is not authenticated");
                    dispatch(logout());
                }
            } catch (error) {
                console.log("Error occurred during auth verification:", error);
                dispatch(logout());
            }
            finally{
                setIsCheckingAuth(false);
            }
        }

        if(!user){
            checkAuth();
        }
        else{
            setIsCheckingAuth(false);
        }
    }, [verifyAuth, dispatch, user]);

    if(isLoading && isCheckingAuth){
        return <BookLoader />;
    }

    return <>{children}</>;
}