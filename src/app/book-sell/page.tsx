"use client"

import { BookDetails } from '@/lib/types/type';
import { useAddProductsMutation } from '@/store/api';
import { toggleLoginDialog } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import NoData from '../components/NoData';

const page = () => {

    const [uploadImages, setUploadImages] = useState<string[]>([]);
    const [addProducts] = useAddProductsMutation();
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state:RootState)=> state.user.user);

    const {register, handleSubmit, watch,  setValue, reset, formState:{errors}} = useForm<BookDetails>({defaultValues:{images:[]}});

    const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files;
        if(files && files.length>0){
            const newFiles = Array.from(files);
            const currentFiles = watch('images') || [];

            setUploadImages((prevImage)=>
                [...prevImage, ...newFiles.map((file)=> URL.createObjectURL(file))].slice(0,4)
            )

            setValue('images', [...currentFiles, ...newFiles].slice(0,4) as string[]);
        }
    }

    const removeImage = (index:number)=>{
        setUploadImages((prev)=> prev.filter((_, i)=> i!= index));

        const currentFiles = watch('images') || [];
        const uploadFiles = currentFiles.filter((_, i)=> i!= index);
        setValue('images', uploadFiles);
    }

    const onSubmit = async(data:BookDetails)=>{
        try {
           const formData = new FormData();
           Object.entries(data).forEach(([key, value])=>{
                if(key!== 'images'){
                    formData.append(key, value as string);
                }
           })

           if(data.paymentMode === 'UPI'){
               formData.append('paymentDetails', JSON.stringify({upiId: data.paymentDetails.upiId}));
           }else if(data.paymentMode === 'Bank Account'){
               formData.set('paymentDetails', JSON.stringify({bankDetails: data.paymentDetails.bankDetails}));
           }

           if(Array.isArray(data.images) &&  data.images.length > 0){
            data.images.forEach((image)=> formData.append('images', image));
           }

           const result = await addProducts(formData).unwrap();
           if(result.success){
            router.push(`/book/${result.data.id}`)
            toast.success('Book added successfully!')
            reset();
           }
        } catch (error) {
            toast.error('Failed to list the  book. Please try again.');
            console.log(error);
            
        }
    }

    const paymentMode = watch('paymentMode');
    const handleOpenLogin = ()=>{
        dispatch(toggleLoginDialog());
    }
     if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  return (
    <div>
      
    </div>
  )
}

export default page
