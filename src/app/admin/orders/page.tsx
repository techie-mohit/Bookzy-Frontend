"use client"
import OrderDetailsDialog from '@/app/account/orders/OrderDetailsDialog';
import AdminLayout from '@/app/components/admin/AdminLayout';
import OrderEditForm from '@/app/components/admin/OrderEditForm';
import OrderPaymentForm from '@/app/components/admin/OrderPaymentForm';
import Pagination from '@/app/components/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BookLoader from '@/lib/BookLoader';
import { useGetAdminOrdersQuery } from '@/store/adminApi';

import { Calendar, CreditCard, Edit, Filter, RotateCcw, Search, ShoppingBag } from 'lucide-react';
import React, { useMemo, useState } from 'react'

const page = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({
        status: '',
        paymentStatus: '',
        startDate: '',
        endDate: '',
        search:''
    });
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [paymentOrder, setPaymentOrder] = useState<any>(null);

    const {data:OrderData, isLoading:isOrderLoading} = useGetAdminOrdersQuery(filters);
    console.log(OrderData);

    const allOrders = OrderData?.data?.orders || [];
    console.log("Fetched orders:", allOrders, "Loading:", isOrderLoading);

    const filteredOrders = useMemo(()=>{
      if(!filters.search) return allOrders;
      const searchTerm = filters.search.toLowerCase();
      return allOrders.filter((order:any)=>{
        return (
          order._id.toLowerCase().includes(searchTerm) ||
          order.user?.name && order.user.name.toLowerCase().includes(searchTerm)
        )
      })
    }, [allOrders, filters.search])

    // Calculate Pagination
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // get current page items
    const currentOrders = useMemo(() => {
      const startIndex = (currentPage - 1) * pageSize;
      return filteredOrders.slice(startIndex, startIndex + pageSize);
    }, [filteredOrders, currentPage, pageSize]);

    const handleFilterChange = (key: string, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1); // Reset to first page on filter change
    }

    const handlePageChange = (page:number)=>{
      setCurrentPage(page);
    }

    const resetFilters = ()=>{
      setFilters({
        status: '',
        paymentStatus: '',
        startDate: '',
        endDate: '',
        search:''
      });
      setCurrentPage(1);
    }

    const handleCloseEditDialog = ()=>{
      setEditingOrder(null);
    }

    const handleClosePaymentDialog = ()=>{
      setPaymentOrder(null);
    }



  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Orders Management
          </h1>
        </div>

        {/* filters  */}
        <Card className='shadow-md border border-gray-200'>
          <CardHeader className='pb-3'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div>
                <CardTitle className='text-lg sm:text-xl flex items-center gap-2'>
                  <Filter className='h-5 w-5 text-blue-600'/>
                  Filters
                </CardTitle>
                <CardDescription className='mt-1'>
                  Filter orders by various criteria
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={resetFilters}
                className='flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-400 w-full sm:w-auto justify-center'
              >
                <RotateCcw className='h-4 w-4'/>
                Reset Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Order Status
                </label>
                <Select value={filters.status} onValueChange={(value)=>handleFilterChange("status", value)}>
                  <SelectTrigger className='w-full border-gray-300 focus:ring-blue-500'>
                    <SelectValue placeholder='All Statuses'></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='processing'>Processing</SelectItem>
                    <SelectItem value='shipped'>Shipped</SelectItem>
                    <SelectItem value='delivered'>Delivered</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Payment Status
                </label>
                <Select value={filters.paymentStatus} onValueChange={(value)=>handleFilterChange("paymentStatus", value)}>
                  <SelectTrigger className='w-full border-gray-300 focus:ring-blue-500'>
                    <SelectValue placeholder='All Statuses'></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='complete'>Complete</SelectItem>
                    <SelectItem value='failed'>Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Search
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'/>
                  <Input
                    placeholder='Order ID or customer...'
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className='pl-9 border-gray-300 focus:ring-blue-500'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  Start Date
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'/>
                  <Input
                    type='date'
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className='pl-9 border-gray-300 focus:ring-blue-500'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>
                  End Date
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'/>
                  <Input
                    type='date'
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className='pl-9 border-gray-300 focus:ring-blue-500'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Orders Table */}
        <Card className='shadow-md border border-gray-200 p-2'>
          <CardHeader className='pb-3'>
              <CardTitle className='text-lg sm:text-xl flex items-center gap-2'>
                <ShoppingBag className='h-5 w-5 text-green-600'/>
                Orders
              </CardTitle>
              <CardDescription>
                Showing {currentOrders.length} of {filteredOrders.length} orders {isOrderLoading && "(Loading...)"}
              </CardDescription>
          </CardHeader>

          <CardContent>
            {
              isOrderLoading ? (
                <>
                 <div className='text-center py-10'>
                  <BookLoader/>
                </div>
               </>
               
              ): currentOrders.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className= "mx-auto h-12 w-12 text-gray-400"/>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Order Found</h3>
                  <p className="mt-1 text-xm text-gray-500">Try adjusting your filters or search criteria.</p>
                </div>
              ):(
                <div className='pverflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Id</TableHead>
                        <TableHead>Customer</TableHead>
                         <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>                   
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        currentOrders.map((order:any)=>(
                          <TableRow key={order._id}>
                            <TableCell className='font-medium'>#{order._id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>{order.user && order.user.name }</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "pending" ? "bg-blue-100 text-blue-800" :
                          order.status === "shipped" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "complete" ? "bg-green-100 text-green-800" :
                          order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" :"bg-red-100 text-red-800"
                        }`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell className='text-right'>
                        <div className='flex justify-end space-x-2'>
                          <OrderDetailsDialog order = {order}/>
                          <Button variant='outline' size='sm' onClick={()=>setEditingOrder(order)} >
                            <Edit className='h-4 w-4 mr-1'/> Edit
                          </Button>

                          <Button variant="outline" size="sm" onClick={()=> setPaymentOrder(order)}>
                            <CreditCard className='h-4 w-4 mr-1'/> 
                            Pay Seller
                          </Button>
                        </div>
                      </TableCell>
                          </TableRow>
                        ))

                      }
                    </TableBody>
                  </Table>

                </div>
                
              )
            }

            {/* custom pagination */}
            {
              !isOrderLoading && currentOrders.length > 0 && (
                <div className="mt-5">
                  <Pagination currentPage = {currentPage} totalPage={totalPages} onPageChange={handlePageChange}/>

                </div>
                
              )
            }
            
          </CardContent>
        </Card>
      </div>

        {/* Edit Order Dialog */}
        {editingOrder && (
          <Dialog open={!!editingOrder} onOpenChange={(open)=> !open && handleCloseEditDialog()}>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-700">
                  Edit Order
                </DialogTitle>
                <OrderEditForm order={editingOrder} onClose={handleCloseEditDialog}/>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {/* Payment Dialog */}
         {paymentOrder && (
          <Dialog open={!!paymentOrder} onOpenChange={(open)=> !open && handleClosePaymentDialog()}>
            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-700">
                  Payment Seller Order
                </DialogTitle>
                <OrderPaymentForm order={paymentOrder} onClose={handleClosePaymentDialog}/>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
    </AdminLayout>
  )
}

export default page