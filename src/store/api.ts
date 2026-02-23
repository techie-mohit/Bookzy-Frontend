// createApi is a function used to define/create an API service in RTK Query.
    // It helps you:
    // Define server ka  base URL
    // Define server ka endpoints (GET, POST, PUT, DELETE)
    // Handle caching automatically
    // Generate React hooks automatically
    // So you don't need to manually use fetch, axios, useState, useEffect.

// fetchBaseQuery ek helper function hai jo fetch API use karke server se data lane me help karta hai.
    // Ye automatically handle karta hai:
    // base URL
    // headers
    // request
    // response parsing
    // Ye fetch ka simplified version hai.   
    
// without using fetchBaseQuery, aapko manually fetch/axios se request bhejni padti, headers set karne padte, response parse karna padta, error handling karni padti.  




import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
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


    // BASE_URL = https://api.example.com
    // endpoint url = /products
    // final url =  https://api.example.com/products


// Ye Redux store mein ek RTK Query API slice banata hai
export const api = createApi({

    // ✅ baseQuery:
    // Ye batata hai ki sab endpoints ki request kaise jayegi
    // fetchBaseQuery ek simplified fetch wrapper hai
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,         // Sab requests isi base URL se start hongi
        credentials: 'include',    // Cookies ko request mein bhejne ke liye
    }),

    tagTypes: ['User', 'Product', 'Cart', 'Wishlist', 'Order', 'Address'],
    endpoints: (builder) => ({          // builder use hota hai create karne ke liye:
    

        // USER ENDPOINTS

        register: builder.mutation({                // builder.mutation use hota hai POST, PUT, DELETE requests ke liye
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
            invalidatesTags: ['User']                      // "User data change ho gaya → cache refresh karo" Automatically  fir se call ho jayega.
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

        getProducts: builder.query({                        // builder.query  Used for GET requests
            query: () => ({
                url: API_URLS.PRODUCTS,
                credentials: 'omit',   // skip cookies
            }),
            providesTags: ['Product']                          // "Ye endpoint Product data provide karta hai"  and Used to mark cached data.
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



// Tag Types kya hote hain?
// Tag Types are used to identify and manage cached data in RTK Query.
// Common tag types include: 'Product', 'User', 'Cart', 'Wishlist', 'Order', 'Address'
// When an endpoint invalidates a tag, it tells RTK Query to refresh any cached data associated with that tag.
// Ye define karta hai ki application me kaun-kaun se data categories (jaise User, Product, Cart, etc.) cache honge aur unko kaise track kiya jayega. Jab koi query data fetch karti hai, to wo providesTags ke through us data ko ek specific tag ke under cache me store karti hai, aur jab koi mutation data ko change karta hai (jaise add, update, delete), to wo invalidatesTags ke through us tag ko invalidate karta hai, jisse RTK Query automatically data ko refetch karta hai aur UI ko latest data ke sath update kar deta hai. Isse performance improve hoti hai, unnecessary API calls reduce hoti hain, aur data hamesha fresh aur synchronized rehta hai without manually refreshing the page.


// Provide and Invalidate Tags kya hote hain?
// Provide Tags: Jab aap kisi query endpoint me providesTags use karte hain, to aap RTK Query ko batate hain ki ye endpoint kis tag type ka data provide karta hai. Iska matlab hai ki jab ye query successfully data fetch karti hai, to wo us data ko specified tag ke sath cache me store kar degi. For example, agar aap getProducts query me providesTags: ['Product'] set karte hain, to iska matlab hai ki ye query Product tag type ka data provide karti hai aur jab bhi ye query call hogi, to fetched products data Product tag ke under cache me store ho jayega.


// Invalidate Tags: Invalidate = cache ko invalid mark karna, not directly change data  Jab aap kisi mutation endpoint me invalidatesTags use karte hain, to aap RTK Query ko batate hain ki ye mutation kis tag type ke data ko invalidate karta hai. Iska matlab hai ki jab ye mutation successfully execute hoti hai (jaise add, update, delete), to wo specified tag ke sath associated cached data ko invalidate kar degi. For example, agar aap addProducts mutation me invalidatesTags: ['Product'] set karte hain, to iska matlab hai ki jab bhi ye mutation call hogi aur successfully execute hogi, to Product tag ke under cache me stored products data invalidate ho jayega, jisse RTK Query automatically getProducts query ko refetch(fetch karna data dubara from server se ) karega aur UI ko latest products data ke sath update kar dega. Isse ensure hota hai ki aapka UI hamesha fresh aur synchronized data dikhata hai without manually refreshing the page.