// ✅ redux-toolkit/query se do important utilities import kiye hain:
// 1️⃣ createApi - RTK Query ka main function jo API service banata hai
// 2️⃣ fetchBaseQuery - ek built-in baseQuery function jo simple fetch request banata hai
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URLS = {

    // user related urls 
    REGISTER : `${BASE_URL}/auth/register`,
    LOGIN : `${BASE_URL}/auth/login`,
    VERIFY_EMAIL :(token:string)=> `${BASE_URL}/auth/verify-email/${token}`,
    FORGOT_PASSWORD : `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD : (token:string)=> `${BASE_URL}/auth/reset-password/${token}`,
    VERIFY_AUTH : (token:string)=> `${BASE_URL}/auth/verify`,
    LOGOUT : `${BASE_URL}/auth/logout`,
    UPDATE_USER_PROFILE : (userId:string)=> `${BASE_URL}/user/profile/update/${userId}`,

    // product related urls
    PRODUCTS: `${BASE_URL}/products`,
    PRODUCT_BY_ID: (id:string)=> `${BASE_URL}/products/${id}`,
    GET_PRODUCT_BY_SELLER_ID : (sellerId:string)=> `${BASE_URL}/products/seller/${sellerId}`,
    DELETE_PRODUCT_BY_SELLER_ID : (productId:string)=> `${BASE_URL}/products/seller/${productId}`,


    // cart related urls
    CART:(userId: string)=> `${BASE_URL}/cart/${userId}`,
    ADD_TO_CART: `${BASE_URL}/cart/add-to-cart`,
    REMOVE_FROM_CART: (productId:string)=> `${BASE_URL}/cart/remove-from-cart/${productId}`,


    // wishlist related urls
    WISHLIST: (userId: string) => `${BASE_URL}/wishlist/${userId}`,
    ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add-to-wishlist`,
    REMOVE_FROM_WISHLIST: (productId: string) => `${BASE_URL}/wishlist/remove-from-wishlist/${productId}`,


    // order related urls
    ORDERS: `${BASE_URL}/order`,
    ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
    CREATE_RAZORPAY_PAYMENT : `${BASE_URL}/order/payment-razorpay`,

    // address related urls
    ADD_ADDRESS: `${BASE_URL}/user/address/create-or-update`,
    GET_ADDRESS: `${BASE_URL}/user/address`


}


// Ye Redux store mein ek RTK Query API slice banata hai
export const api = createApi({

    // ✅ baseQuery:
    // Ye batata hai ki sab endpoints ki request kaise jayegi
    // fetchBaseQuery ek simplified fetch wrapper hai
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,         // Sab requests isi base URL se jayengi
        credentials: 'include',    // Cookies ko request mein bhejne ke liye
                                   // Useful for authentication (e.g., sessions)
    }),

    // ✅ tagTypes:
    // Ye ek optional config hai
    // RTK Query cache invalidation ke liye tags define karta hai
    // Example mein 'User' tag define kiya hai
    // Iska use refetch/invalidating cache ke liye hota hai
    tagTypes:['User'],

    // ✅ endpoints:
    // Ye function hai jo sab endpoints define karega
    // Builder pattern use karke queries aur mutations banate hain
    // Filhal ye empty hai => koi endpoint nahi define kiya
    endpoints :(builder)=>({
        // ⚠️ abhi yahan koi endpoint nahi likha
        // future mein builder.query ya builder.mutation se endpoints banayenge
    })

})
