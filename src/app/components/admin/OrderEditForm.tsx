import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOrdersMutation } from '@/store/adminApi';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

interface OrderEditFormProps {
    order: any; // replace with actual order type
    onClose: () => void;
}

const OrderEditForm: React.FC<OrderEditFormProps> = ({ order, onClose }) => {
    const [status, setStatus] = React.useState(order.status);

    const [paymentStatus, setPaymentStatus] = React.useState(order.paymentStatus);

    const [notes, setNotes] = React.useState(order.notes || '');

    const [updateOrder, { isLoading }] = useUpdateOrdersMutation();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateOrder({ orderId: order._id, updates: { status, paymentStatus, notes } }).unwrap();
            toast.success("Order updated successfully");
            onClose();
            router.refresh();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update order");
            console.error("Failed to update order:", error);
        }
    }
    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
                <div className='space-y-4'>
                    <Label htmlFor="status" className='text-sm font-medium text-gray-700'>Order Status</Label>
                    <Select value={status} onValueChange={setStatus} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select order status" />

                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='processing'>Processing</SelectItem>
                            <SelectItem value='shipped'>Shipped</SelectItem>
                            <SelectItem value='delivered'>Delivered</SelectItem>
                            <SelectItem value='cancelled'>Cancelled</SelectItem>
                        </SelectContent>
                    </Select>


                </div>

                <div className='space-y-4'>
                    <Label htmlFor="paymentStatus" className='text-sm font-medium text-gray-700'>Payment Status</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Payment status" />

                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='pending'>Pending</SelectItem>
                            <SelectItem value='complete'>Complete</SelectItem>
                            <SelectItem value='failed'>Failed</SelectItem>
                        </SelectContent>
                    </Select>


                </div>

                <div className='space-y-2'>
                    <Label htmlFor="paymentStatus">Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes related to the order here"
                        rows={3}
                    />
                </div>

                <div className='flex justify-end space-x-2'>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={isLoading} className='bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 to-indigo-800'>
                        {
                            isLoading ? 'Updating...' : 'Update Order'
                        }
                    </Button>
                </div>


            </div>
        </form>
    )
}

export default OrderEditForm