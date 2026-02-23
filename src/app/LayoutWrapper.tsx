"use client";


import BookLoader from "@/lib/BookLoader";
import { persistor , store } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import AuthCheck from "@/store/Provider/AuthProvider";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";


export default function LayoutWrapper({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    return (
        <Provider store={store}>
            <PersistGate loading={<BookLoader/>} persistor={persistor}>
                <Toaster />
                <AuthCheck>
                    {!isAdminRoute && <Header />} {/* Admin routes ke liye header hide karna */ }
                    {children}
                    {!isAdminRoute && <Footer />} {/* Admin routes ke liye footer hide karna */ }
                </AuthCheck>
            </PersistGate>
        </Provider>
    )
}