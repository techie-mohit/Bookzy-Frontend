import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { get } from 'http';
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL , credentials: 'include'}),
    tagTypes: ['AdminStats', "AdminOrders", "SellerPayments"],
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/admin/dashboard-stats',
            providesTags: ['AdminStats'],
        }),

        getAdminOrders : builder.query({
            query:(params) => {
                const queryParams = new URLSearchParams();
                if(params){
                    Object.entries(params).forEach(([key, value]) => {
                        if (value) {
                            queryParams.append(key, value as string);
                        }
                    });
                }
                return `/admin/orders?${queryParams}`;
            },
            providesTags: ['AdminOrders'],
        }),

        updateOrders : builder.mutation({
            query:({orderId, updates}) => ({
                url: `/admin/orders/${orderId}/status`,
                method: 'PUT',
                body: updates
            }),
            invalidatesTags:(result, error, {orderId}) =>  [
                {type: 'AdminOrders', id: orderId},
                "AdminOrders",
                "AdminStats",
            ] 
        }),

        getSellerPayments : builder.query({
            query:(params) => {
                const queryParams = new URLSearchParams(params);
                if(params){
                    Object.entries(params).forEach(([key, value]) => {
                        if (value) {
                            queryParams.append(key, value.toString());
                        }
                    });
                }
                return `/admin/seller-payments?${queryParams}`;
            },
            providesTags: ['SellerPayments'],
        }),

        processSellerPayments : builder.mutation({
            query:({orderId, paymentData}) => ({
                url: `/admin/process-seller-payment/${orderId}`,
                method: 'POST',
                body: paymentData
            }),
            invalidatesTags:(result, error, {orderId}) =>  [
                {type: 'AdminOrders', id: orderId},
                "AdminOrders",
                "AdminStats",
                "SellerPayments"
            ] 
        }),
    }),
});


export const {
    useGetDashboardStatsQuery,
    useGetAdminOrdersQuery,
    useUpdateOrdersMutation,
    useGetSellerPaymentsQuery,
    useProcessSellerPaymentsMutation
} = adminApi;
