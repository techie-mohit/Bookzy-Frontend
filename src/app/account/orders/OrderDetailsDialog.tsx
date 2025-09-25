import CartItems from '@/app/components/CartItems';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/lib/types/type';
import { CheckCircle, Eye, Package, Truck, XCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface OrderDetailsDialogProps {
    order: Order;
}

const StatusStep = ({ icon, title, isCompleted, isActive }: { icon: React.ReactNode; title: string; isCompleted: boolean; isActive: boolean }) => {
    return (
        <div className={`flex flex-col items-center ${isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-400'}`}>
            <div className={`rounded-full p-2 ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-200'}`}>
                {icon}
            </div>
            <span className='text-xs mt-1'>{title}</span>
        </div>
    )

}

const OrderDetailsDialog = ({ order }: OrderDetailsDialogProps) => {

    console.log("orders ", order);

    const getStatusIndex = (Status: string) => {
        const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];
        return statuses.indexOf(Status);
    }
    const statusIndex = getStatusIndex(order?.status);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='text-2xl font-bold text-purple-700'>Order Details</DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                    <div className='bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg'>
                        <h3 className='font-semibold text-lg text-purple-800 mb-2'>Order Status</h3>
                        <div className='flex justify-between items-center'>
                            <StatusStep
                                title="processing"
                                icon={<Package className="h-6 w-6" />}
                                isCompleted={statusIndex > 0}
                                isActive={statusIndex === 0}
                            />
                            <div className={`h-1 flex-1 ${statusIndex > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />

                            <StatusStep
                                title="shipped"
                                icon={<Truck className="h-6 w-6" />}
                                isCompleted={statusIndex > 1}
                                isActive={statusIndex === 1}
                            />
                            <div className={`h-1 flex-1 ${statusIndex > 1 ? 'bg-green-500' : 'bg-gray-300'}`} />

                            <StatusStep
                                title="delivered"
                                icon={<CheckCircle className="h-6 w-6" />}
                                isCompleted={statusIndex > 2}
                                isActive={statusIndex === 2}
                            />

                            {order?.status === 'cancelled' && (
                                <>
                                    <div className='h-1 flex-1 bg-red-500' />
                                    <StatusStep
                                        title="cancelled"
                                        icon={<XCircle className="h-6 w-6" />}
                                        isCompleted={true}
                                        isActive={true}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className='bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg'>
                        <h3 className="font-semibold text-lg text-blue-800 mb-2">Items</h3>
                        <div className='space-y-4'>
                            {order?.items?.map((items, index) => (
                                <div key={index} className='flex items-center space-x-4'>
                                    <Image
                                        src={items.product?.images[0]}
                                        alt={items.product?.title}
                                        width={80}
                                        height={80}
                                        className='rounded-md'
                                    />
                                    <div>
                                        <p className='font-medium'>{items.product?.title}</p>
                                        <div className='flex gap-2'>
                                            <p className='font-medium'>{items.product?.subject}</p>
                                            ({order.items.map(item => item.product?.author).join(", ")})
                                        </div>
                                        <p className='text-sm text-gray-600'>Quantity : {items.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg'>
                        <h3 className='font-serif text-lg text-green-800 mb-2'>Shipping Address</h3>
                        <p>{order?.shippingAddress?.[0]?.addressLine1}</p>
                        <p>{order?.shippingAddress?.[0]?.city}, {order?.shippingAddress?.[0]?.state} - {order?.shippingAddress?.[0]?.pincode}</p>
                    </div>

                    <div className='bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg'>
                        <h3 className='font-serif text-lg text-green-800 mb-2'>Payment Details</h3>
                        <p>Order ID : {order?.paymentDetails?.razorpay_order_id}</p>
                        <p>Payment ID : {order?.paymentDetails?.razorpay_payment_id}</p>
                        <p>Amount : ₹{order?.totalAmount}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderDetailsDialog