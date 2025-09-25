"use client";

import { BookDetails } from "@/lib/types/type";
import { useAddProductsMutation } from "@/store/api";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Link from "next/link";
import {
  Book,
  Camera,
  ChevronRight,
  DollarSign,
  HelpCircle,
  Loader2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filters } from "@/lib/Constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const page = () => {
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [addProducts, {isLoading}] = useAddProductsMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<BookDetails>({ defaultValues: { images: [] } });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = watch("images") || [];

      setUploadImages((prevImage) =>
        [
          ...prevImage,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4)
      );

      setValue(
        "images",
        [...currentFiles, ...newFiles].slice(0, 4) as string[]
      );
    }
  };

  const removeImage = (index: number) => {
    setUploadImages((prev) => prev.filter((_, i) => i != index));

    const currentFiles = watch("images") || [];
    const uploadFiles = currentFiles.filter((_, i) => i != index);
    setValue("images", uploadFiles);
  };

const onSubmit = async (data: BookDetails) => {
  try {
    const formData = new FormData();

    // Append all top-level fields except images and paymentDetails
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images" && key !== "paymentDetails") {
        formData.append(key, value as string);
      }
    });

    // Prepare paymentDetails based on paymentMode
    let paymentDetails: any = {};
    if (data.paymentMode === "UPI") {
      const upiId = data.paymentDetails?.upiId;
      if (!upiId) {
        toast.error("UPI ID is required");
        return;
      }
      paymentDetails = { upiId }; // matches backend
    } else if (data.paymentMode === "Bank Account") {
      const bank = data.paymentDetails?.bankDetails;
      if (!bank?.accountNumber || !bank?.ifscCode || !bank?.bankName) {
        toast.error("Complete bank details are required");
        return;
      }
      paymentDetails = { bankDetails: bank }; // matches backend
    }

    formData.append("paymentDetails", JSON.stringify(paymentDetails));

    // Append images
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((image) => formData.append("images", image));
    }

    const result = await addProducts(formData).unwrap();
    if (result.success) {
      router.push(`/book/${result.data.id}`);
      toast.success("Book added successfully!");
      reset();
    }
  } catch (error: any) {
    console.log(error);
    toast.error(error.message || "Failed to list the book. Please try again.");
  }
};


  const paymentMode = watch("paymentMode");
  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Sell Your Used Books
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Submit a Free Classified Add to Sell your used Books for cash in
            India
          </p>
          <Link
            href="#"
            className="text-blue-500 hover:underline inline-flex items-center"
          >
            Learn How It Works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Book Details */}
          <Card className="shadow-lg border-t-4 border-t-cyan-500">
            <CardHeader className="bg-gradient-to-r from-cyan-100 py-4  to-cyan-50 ">
              <CardTitle className="text-2xl text-cyan-700 flex items-center  ">
                <Book className="mr-2 h-6 w-6" />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="title"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Add Title
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("title", {
                      required: "Title is required",
                    })}
                    placeholder="Enter your add title"
                    type="text"
                    className="pl-4"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="category"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Book Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Book Type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full pl-4">
                          <SelectValue placeholder="Select Book type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.category.map((item, idx) => (
                            <SelectItem key={idx} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="condition"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Book Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book condition is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        {filters.condition.map((con, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={con.toLowerCase()}
                              id={con.toLowerCase()}
                            />
                            <Label htmlFor={con.toLowerCase()}>{con}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  {errors.condition && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="classType"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  For Class
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: "Class Type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full pl-4">
                          <SelectValue placeholder="Select Class type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.classType.map((classType, idx) => (
                            <SelectItem key={idx} value={classType}>
                              {classType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.classType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.classType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="subject"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Book Subject
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("subject", {
                      required: "subject is required",
                    })}
                    placeholder="Enter your Book Subject"
                    type="text"
                    className="pl-4"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label className="block mb-2 font-medium text-gray-700">
                  Upload Photos
                </Label>
                <div className="border-2 boder-dashed border-cyan-300 rounded-lg p-4 bg-cyan-50">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-cyan-400" />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer text-sm font-medium text-cyan-700 hover:underline"
                    >
                      click here to upload up to 4 images(size: 15MB max. each)
                    </Label>

                    <Input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="images/"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>

                  {uploadImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadImages.map((image, idx) => (
                        <div key={idx} className="relative">
                          <Image
                            src={image}
                            alt={`Uploaded image ${idx + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-32 border border-gray-200"
                          />

                          <Button
                            onClick={() => removeImage(idx)}
                            size="icon"
                            className="absolute -right-1 -top-1"
                            variant="destructive"
                          >
                            <X className="w-8 h-8" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* optional details */}
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 py-4  to-emerald-50 ">
              <CardTitle className="text-2xl text-green-700 flex items-center  ">
                <HelpCircle className="mr-2 h-6 w-6" />
                Optional Details
              </CardTitle>
              <CardDescription>
                (Description, MRP, Author, etc...)
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Accordion className="w-full" type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Book Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label
                          htmlFor="price"
                          className="md:w-1/4 font-medium text-gray-700"
                        >
                          MRP
                        </Label>
                        <div className="md:w-3/4">
                          <Input
                            {...register("price", {
                              required: "Book MRP is required",
                            })}
                            placeholder="Enter the MRP"
                            type="text"
                            className="pl-4"
                          />
                          {errors.price && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.price.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label
                          htmlFor="author"
                          className="md:w-1/4 font-medium text-gray-700"
                        >
                          Author
                        </Label>
                        <div className="md:w-3/4">
                          <Input
                            {...register("author")}
                            placeholder="Enter the author's name"
                            type="text"
                            className="pl-4"
                          />
                          {errors.author && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.author.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Label
                          htmlFor="edition"
                          className="md:w-1/4 font-medium text-gray-700"
                        >
                          Edition (years)
                        </Label>
                        <div className="md:w-3/4">
                          <Input
                            {...register("edition")}
                            placeholder="Enter your edition year"
                            type="text"
                            className="pl-4"
                          />
                          {errors.edition && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.edition.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="mb-3 ">
                  <AccordionTrigger>Add Description</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 ">
                        <Label
                          htmlFor="description"
                          className="md:w-1/4 font-medium text-gray-700"
                        >
                          Description
                        </Label>
                        <Textarea
                          {...register("description")}
                          placeholder="Enter the book description"
                          className="md:w-3/4"
                          rows={4}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* price Details */}
          <Card className="shadow-lg border-t-4 border-t-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 py-4  to-amber-50 ">
              <CardTitle className="text-2xl text-yellow-700 flex items-center  ">
                <DollarSign className="mr-2 h-6 w-6" />
                Price Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="finalPrice"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Your Price (₹)
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("finalPrice", {
                      required: "Final Price is required",
                    })}
                    placeholder="Enter your book final Price"
                    type="text"
                    className="pl-4"
                  />
                  {errors.finalPrice && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.finalPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                <Label className="md:w-1/4 mt-2 font-medium text-gray-700">
                  Shipping Charges
                </Label>
                <div className="space-y-2 md:w-3/4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="shippingCharge"
                      {...register("shippingCharge")}
                      placeholder="Enter Shipping Charges"
                      type="text"
                      className="w-full md:w-1/2"
                      disabled={watch("shippingCharge") === "free"}
                    />
                    <span className="text-sm"> Or </span>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="shippingCharge"
                        control={control}
                        rules={{ required: "Shiiping Charge is required" }}
                        render={({ field }) => (
                          <Checkbox
                            id="freeShipping"
                            checked={field.value === "free"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "free" : "");
                            }}
                          />
                        )}
                      />

                      <Label htmlFor="freeshipping">Free Shipping</Label>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Buyers prefer free shipping or low shipping charges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="shadow-lg border-t-4 border-t-violet-500">
            <CardHeader className="bg-gradient-to-r from-violet-100 py-4  to-indigo-50 ">
              <CardTitle className="text-2xl text-violet-700 flex items-center  ">
                <Book className="mr-2 h-6 w-6" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Payment Mode
                </Label>
                <div className="space-y-2 md:w-3/4">
                <p className="text-sm text-muted-foreground mb-2">After your book is sold , in what mode would you like to receive the payment?</p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment Mode is required" }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="UPI" id="UPI" {...register('paymentMode')} />
                          <Label htmlFor="UPI">UPI Id / Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Bank Account" id="bank account" {...register('paymentMode')} />
                          <Label htmlFor="bank account">Bank Account</Label>
                        </div>

                      </RadioGroup>
                    )}
                  />

                  {errors.paymentMode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {
                paymentMode === 'UPI' && (
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="upiId"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  UPI ID
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("paymentDetails.upiId", {
                      required: "UPI ID is required",
                      pattern: {
                        value: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/,
                        message: "Invalid UPI ID format"
                      }
                    })}
                    placeholder="Enter your UPI ID"
                    type="text"
                    className="pl-4"
                  />
                  {errors.paymentDetails?.upiId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentDetails.upiId.message}
                    </p>
                  )}
                </div>
              </div>


                )}

                {
                  paymentMode === 'Bank Account' && (
                   <>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="accountNumber"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Account Number
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("paymentDetails.bankDetails.accountNumber", {
                      required: "Account Number is required",
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message: "Invalid Account Number format"
                      }
                    })}
                    placeholder="Enter your Account Number"
                    type="text"
                    className="pl-4"
                  />
                  {errors.paymentDetails?.bankDetails?.accountNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentDetails.bankDetails.accountNumber.message}
                    </p>
                  )}
                </div>
              </div>
              
               <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="ifscCode"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  IFSE Code
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("paymentDetails.bankDetails.ifscCode", {
                      required: "IFSC Code is required",
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC Code format"
                      }
                    })}
                    placeholder="Enter your IFSC Code"
                    type="text"
                    className="pl-4"
                  />
                  {errors.paymentDetails?.bankDetails?.ifscCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentDetails.bankDetails.ifscCode.message}
                    </p>
                  )}
                </div>
              </div>
              
               <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="bankName"
                  className="md:w-1/4 font-medium text-gray-700"
                >
                  Bank Name
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("paymentDetails.bankDetails.bankName", {
                      required: "Bank Name is required",
                    })}
                    placeholder="Enter your Bank Name"
                    type="text"
                    className="pl-4"
                  />
                  {errors.paymentDetails?.bankDetails?.bankName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentDetails.bankDetails.bankName.message}
                    </p>
                  )}
                </div>
              </div>
            </>

                  )}
              
              
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-60 text-md bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
            {isLoading ? (
              <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Saving ...
              </>
            ) : ("Post Your Books")}
          </Button>

         <p className="mt-2 text-sm text-center text-gray-600">
            By Clicking "Post Your Books", you agree to our{" "}
            <Link href="/terms-of-use" className="text-blue-500 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-blue-500 underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
