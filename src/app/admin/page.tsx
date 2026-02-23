"use client"

import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/store/adminApi';
import BookLoader from '@/lib/BookLoader';
import { color } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, IndianRupee, ShoppingBag, TrendingUp, User } from 'lucide-react';

const page = () => {

    const router = useRouter();
    
      const user = useSelector((state:RootState) => state.user.user);
      const {data , isLoading, isError} = useGetDashboardStatsQuery({});
      console.log("Dashboard stats:", data, "Loading:", isLoading, "Error:", isError);
       const stats = data?.data;
       console.log("Extracted stats:", stats);

         
      useEffect(()=>{
        if(user && user.role !== "admin"){
          router.push('/');
        }
      },[ user, router]);

      if(isLoading){
        return (
          <AdminLayout>
            <div className='flex justify-center items-center h-96'>
              ...loading
            </div>
          </AdminLayout>
        )
      }

      if(isError){
        return (
          <AdminLayout>
            <div className='text-center py-10'>
              <h2 className='text-2xl font-semibold text-red-600'>Failed to load dashboard stats. Please try again later.</h2>
            </div>
          </AdminLayout>
        )
      }

      // prepare data fo chart
      const orderStatusData = [
        { name: 'Pending', value: stats?.ordersByStatus?.pending || 0, color: 'text-yellow-500' },
        { name: 'Processing', value: stats?.ordersByStatus?.processing || 0 , color: 'text-blue-500'},
        { name: 'Shipped', value: stats?.ordersByStatus?.shipped || 0 , color: 'text-purple-500'},
        { name: 'Delivered', value: stats?.ordersByStatus?.delivered || 0 , color: 'text-green-500'},
        { name: 'Cancelled', value: stats?.ordersByStatus?.cancelled || 0 , color: 'text-red-500'},
      ]

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const salesData = stats?.monthlySales?.map((item:any) => ({
        name: `${monthNames[item._id - 1]} ${item._id.year}`,
        sales: item.total,
        orders : item.count,
      }));


  return (
    <AdminLayout>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>

        {/* stats Overview */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-gradient-to-r from-purple-50 to-purple-100 border-none shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-500'>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex item-center'>
                <div className='rounded-full bg-purple-200 p-2 mr-4'>
                  <ShoppingBag className='h-6 w-6 text-purple-700'/>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-800'>
                  {stats?.counts?.orders || 0}
                </div>
                <p className='text-xs text-gray-500'>
                  <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                  <span className='text-green-500 font-medium'>+12%</span> from last month
                </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-blue-50 to-blue-100 border-none shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-500'>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex item-center'>
                <div className='rounded-full bg-blue-200 p-2 mr-4'>
                  <User className='h-6 w-6 text-blue-700'/>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-800'>
                  {stats?.counts?.users || 0}
                </div>
                <p className='text-xs text-gray-500'>
                  <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                  <span className='text-green-500 font-medium'>+8%</span> from last month
                </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-green-50 to-green-100 border-none shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-500'>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex item-center'>
                <div className='rounded-full bg-green-200 p-2 mr-4'>
                  <BookOpen className='h-6 w-6 text-green-700'/>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-800'>
                  {stats?.counts?.products || 0}
                </div>
                <p className='text-xs text-gray-500'>
                  <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                  <span className='text-green-500 font-medium'>+5%</span> from last month
                </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-r from-amber-50 to-amber-100 border-none shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-500'>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex item-center'>
                <div className='rounded-full bg-amber-200 p-2 mr-4'>
                  <ShoppingBag className='h-6 w-6 text-amber-700'/>
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-800'>
                  ₹{stats?.counts?.revenue.toLocaleString() || 0}
                </div>
                <p className='text-xs text-gray-500'>
                  <IndianRupee className='inline h-3 w-3 text-green-500 mr-1'/>
                  <span className='text-green-500 font-medium'>+15%</span> from last month
                </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope="col" className='px-6 py-3'>
                      Order ID
                    </th>
                    <th scope="col" className='px-6 py-3'>
                      Customer  
                    </th>
                    <th scope="col" className='px-6 py-3'>
                      Date
                    </th>
                    <th scope="col" className='px-6 py-3'>
                      Amount
                    </th>
                    <th scope="col" className='px-6 py-3'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order:any) => (
                    <tr key={order._id} className='bg-white border-b hover:bg-gray-50'>
                      <td className='px-6 py-4 font-medium text-gray-900'>#{order._id.slice(-6).toUpperCase()}</td>
                      <td className='px-6 py-4'>{order.user && order.user.name }</td>
                      <td className='px-6 py-4'>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className='px-6 py-4'>₹{order.totalAmount}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "processing" ? "bg-blue-100 text-blue-800" :
                          order.status === "shipped" ? "bg-purple-100 text-purple-800" :
                          order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </CardContent>
        </Card>
      </div>

    </AdminLayout>
  )
}

export default page
