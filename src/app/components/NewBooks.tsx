import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/lib/Constant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { set } from "react-hook-form";

const NewBooks = () => {
  const [currentBookSlide, setCurrentBookSlide] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3); // Assuming there are 3 slides
      // Adjust the modulo based on the number of slides you have
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + 3) % 3); // Adjust based on number of slides
  };

  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3); // Adjust based on number of slides
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold  text-center mb-12">
          Newly Added Books
        </h2>
        <div className="relative ">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden ">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBookSlide * 100}%)`,
                  }}
                >
                  {[0, 1, 2].map((slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {books
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((book) => (
                            <Card key={book._id} className="relative">
                              <CardContent className="p-4">
                                <Link href={`books/${book._id}`}>
                                  <div className="relative">
                                    <Image
                                      src={book.images[0]}
                                      alt={book.title}
                                      width={200}
                                      height={300}
                                      className="mb-4 h-[200px] w-full object-cover rounded-md"
                                    />

                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    ) > 0 && (
                                      <div className="absolute left-0 top-2 rounded-r-lg bg-red-500 text-xs font-medium text-white">
                                        {calculateDiscount(
                                          book.price,
                                          book.finalPrice
                                        )}
                                        % OFF
                                      </div>
                                    )}
                                  </div>

                                  <h3 className="mb-2 line-clamp-2 text-sm font-medium ">
                                    {book.title}
                                  </h3>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2 ">
                                      <span className="">
                                        ₹
                                        <span className="text-2xl">
                                          {book.finalPrice}
                                        </span>
                                      </span>
                                      {book.price && (
                                        <span className="text-sm line-through text-muted-foreground">
                                          ₹{book.price}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-zinc-400">
                                      <span> {book.condition}</span>
                                    </div>
                                  </div>

                                  <div className="pt-4">
                                    <Button className="flex float-end mb-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-700 hover:to-orange-800">
                                      Buy Now
                                    </Button>
                                  </div>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll Button */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-sm"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-sm"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* dot animation */}
              <div className="mt-8 flex justify-center space-x-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`h-3 w-3 rounded-full ${
                      currentBookSlide === dot ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">No books available</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBooks;
