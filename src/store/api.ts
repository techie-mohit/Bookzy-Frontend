// ✅ redux-toolkit/query se do important utilities import kiye hain:
// 1️⃣ createApi - RTK Query ka main function jo API service banata hai
// 2️⃣ fetchBaseQuery - ek built-in baseQuery function jo simple fetch request banata hai
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_URLS = {

    // user related urls 
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
    VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    UPDATE_USER_PROFILE: (userId: string) => `${BASE_URL}/user/profile/update/${userId}`,

    // product related urls
    PRODUCTS: `${BASE_URL}/products`,
    PRODUCT_BY_ID: (id: string) => `${BASE_URL}/products/${id}`,
    GET_PRODUCT_BY_SELLER_ID: (sellerId: string) => `${BASE_URL}/products/seller/${sellerId}`,
    DELETE_PRODUCT_BY_PRODUCT_ID: (productId: string) => `${BASE_URL}/products/delete/${productId}`,


    // cart related urls
    CART: (userId: string) => `${BASE_URL}/cart/${userId}`,
    ADD_TO_CART: `${BASE_URL}/cart/add-to-cart`,
    REMOVE_FROM_CART: (productId: string) => `${BASE_URL}/cart/remove-from-cart/${productId}`,


    // wishlist related urls
    WISHLIST: (userId: string) => `${BASE_URL}/wishlist/${userId}`,
    ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add-to-wishlist`,
    REMOVE_FROM_WISHLIST: (productId: string) => `${BASE_URL}/wishlist/remove-from-wishlist/${productId}`,


    // order related urls
    ORDERS: `${BASE_URL}/order`,
    ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
    CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,

    // address related urls
    ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/user/address/create-or-update`,
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
    tagTypes: ['User', 'Product', 'Cart', 'Wishlist', 'Order', 'Address'],

    // ✅ endpoints:
    // Ye function hai jo sab endpoints define karega
    // Builder pattern use karke queries aur mutations banate hain
    // Filhal ye empty hai => koi endpoint nahi define kiya
    endpoints: (builder) => ({
        // ⚠️ abhi yahan koi endpoint nahi likha
        // future mein builder.query ya builder.mutation se endpoints banayenge

        // USER ENDPOINTS

        register: builder.mutation({
            query: (userData) => ({
                url: API_URLS.REGISTER,
                method: 'POST',
                body: userData
            }),
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: API_URLS.LOGIN,
                method: 'POST',
                body: userData
            }),
        }),

        verifyEmail: builder.mutation({
            query: (token) => ({
                url: API_URLS.VERIFY_EMAIL(token),
                method: 'GET',
            }),
        }),

        forgotPassword: builder.mutation({
            query: (userData: { email: string }) => ({
                url: API_URLS.FORGOT_PASSWORD,
                method: 'POST',
                body: userData   // ✅ send as-is, not wrapped again
            }),
            invalidatesTags: ['User']
        }),
        resetPassword: builder.mutation({
            query: ({ token, newPassword }) => ({
                url: API_URLS.RESET_PASSWORD(token),
                method: 'POST',
                body: { newPassword }
            }),
            invalidatesTags: ['User']
        }),

        verifyAuth: builder.mutation({
            query: () => ({
                url: API_URLS.VERIFY_AUTH,
                method: 'GET',
            }),
            invalidatesTags: ['User']
        }),

        logout: builder.mutation({
            query: () => ({
                url: API_URLS.LOGOUT,
                method: 'GET',
            }),
            invalidatesTags: ['User']
        }),

        updateUser: builder.mutation({
            query: ({ userId, userData }) => ({
                url: API_URLS.UPDATE_USER_PROFILE(userId),
                method: 'PUT',
                body: userData
            }),
            invalidatesTags: ['User']
        }),




        // Product Endpoints

        addProducts: builder.mutation({
            query: (productData) => ({
                url: API_URLS.PRODUCTS,
                method: 'POST',
                body: productData
            }),
            invalidatesTags: ['Product']
        }),

        getProducts: builder.query({
            query: () => API_URLS.PRODUCTS,
            providesTags: ['Product']
        }),

        getProductById: builder.query({
            query: (id) => API_URLS.PRODUCT_BY_ID(id),
            providesTags: ['Product']
        }),

        getProductBySellerId: builder.query({
            query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
            providesTags: ['Product']
        }),

        deleteProductById: builder.mutation({
            query: (productId) => ({
                url: API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
                method: 'DELETE',
            }),
            invalidatesTags: ['Product']
        }),



        // Cart Endpoints
        addToCart: builder.mutation({
            query: (productData) => ({
                url: API_URLS.ADD_TO_CART,
                method: 'POST',
                body: productData
            }),
            invalidatesTags: ['Cart']
        }),

        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: API_URLS.REMOVE_FROM_CART(productId),
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart']
        }),

        getCart: builder.query({
            query: (userId) => API_URLS.CART(userId),
            providesTags: ['Cart']
        }),


        // Wishlist Endpoints
        addToWishlist: builder.mutation({
            query: (productId) => ({
                url: API_URLS.ADD_TO_WISHLIST,
                method: 'POST',
                body: { productId }
            }),
            invalidatesTags: ['Wishlist']
        }),

        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: API_URLS.REMOVE_FROM_WISHLIST(productId),
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist']
        }),

        getWishlist: builder.query({
            query: (userId) => API_URLS.WISHLIST(userId),
            providesTags: ['Wishlist']
        }),


        // Order Endpoints

        getOrderById: builder.query({
            query: (orderId) => API_URLS.ORDER_BY_ID(orderId),
            providesTags: ['Order']
        }),

        getUserOrders: builder.query({
            query: () => API_URLS.ORDERS,
            providesTags: ['Order']
        }),

        createOrUpdateOrder: builder.mutation({
            query: ({ orderId, orderData }) => ({
                url: API_URLS.ORDERS,  // '/api/order'
                method: 'POST',
                body: { orderId, ...orderData }, // send orderId in body for updates
            }),
            invalidatesTags: ['Order']
        }),



        createRazorpayPayment: builder.mutation({
            query: (orderId) => ({
                url: API_URLS.CREATE_RAZORPAY_PAYMENT,
                method: 'POST',
                body: { orderId }
            }),

        }),



        // Address Endpoints

        getAddress: builder.query<any[], void>({
            query: () => API_URLS.GET_ADDRESS,
            providesTags: ['Address']
        }),

        addOrUpdateAddress: builder.mutation<any, any>({
            query: (address) => ({
                url: API_URLS.ADD_OR_UPDATE_ADDRESS,
                method: 'POST',
                body: address
            }),
            invalidatesTags: ['Address']
        })

    })

})



export const {
    useRegisterMutation,
    useLoginMutation,
    useVerifyEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyAuthMutation,
    useLogoutMutation,
    useUpdateUserMutation,

    useAddProductsMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductBySellerIdQuery,
    useDeleteProductByIdMutation,

    useAddToCartMutation,
    useRemoveFromCartMutation,
    useGetCartQuery,

    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetWishlistQuery,

    useGetOrderByIdQuery,
    useGetUserOrdersQuery,
    useCreateOrUpdateOrderMutation,
    useCreateRazorpayPaymentMutation,

    useGetAddressQuery,
    useAddOrUpdateAddressMutation
} = api;
