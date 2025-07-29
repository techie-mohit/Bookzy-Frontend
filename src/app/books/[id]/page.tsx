"use client";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = React.useState(0);
  const router = useRouter();
  const [isAddToCart, setIsAddToCart] = React.useState(false);

  const book = {
    _id: "8",
    images: ["https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
    ],
    title: "The Catcher in the Rye",
    category: "Reading Books (Novels)",
    condition: "Fair",
    classType: "11th",
    subject: "Literature",
    price: 350,
    author: "J.D. Salinger",
    edition: "Revised Edition",
    description: "A novel about teenage rebellion and alienation.",
    finalPrice: 300,
    shippingCharge: 15,
    paymentMode: "Bank Account",
    paymentDetails: {
      bankDetails: {
        accountNumber: "1234567890123456",
        ifscCode: "OPQ1234567",
        bankName: "GHI Bank",
      },
    },
    createdAt: new Date("2024-01-08"),
    seller: { name: "David Lee", contact: "6677889900" },
  };

  const handleAddToCart = () => {};

  const handleAddToWhishlist = () => {};

  const bookImage = book?.images || [];

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formData = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4  py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline ">
            {" "}
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="text-primary hover:underline">
            Books
          </Link>
          <span>/</span>
          <span className="text-gray-600">{book.category}</span>
          <span>/</span>
          <span className="text-gray-600">{book.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg border bg-white shadow-md">
              <Image
                src={bookImage[selectedImage]}
                alt={book.title}
                fill
                className="object-contain"
              />
              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                <div className="absolute left-0 top-2 rounded-r-lg  px-2 bg-orange-500 text-sm font-medium text-white">
                  {calculateDiscount(book.price, book.finalPrice)}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {
                    bookImage.map((images, index)=>(
                        <button 
                        key={index}
                        onClick={()=> setSelectedImage(index)}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${selectedImage === index ? 'border-blue-500' : 'border-white opacity-50 blur-[1px]'}`}>
                            
                            <Image
                                src={images}
                                alt={`${book.title} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))
                }
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
