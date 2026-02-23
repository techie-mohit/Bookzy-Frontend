"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { filters } from "@/lib/Constant";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/lib/types/type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  const router = useRouter();

  
    const user = useSelector((state:RootState) => state.user.user);
  
    useEffect(()=>{
      if(user && user.role !== "user"){
        router.push('/admin');
      }
    },[ user, router]);

  const bookPerPage = 6; // Number of books to display per page

  const {data:apiResponse= {}, isLoading} = useGetProductsQuery({});
  const [books, setBooks] = useState<BookDetails[]>([]);

  useEffect(()=>{
    if(apiResponse.success){
      setBooks(apiResponse.data);
    }
  }, [apiResponse])

  // console.log(books);

  const searchTerms = new URLSearchParams(window.location.search).get("search") || "";



  const togglefilter = (section: string, item: string) => {
    const updatedFilter = (prev: string[]) =>
      prev.includes(item)
        ? prev.filter((i) => i != item)
        : [...prev, item];
  

    switch (section) {
      case "category":
        setSelectedCategory(updatedFilter);
        break;
      case "condition":
        setSelectedCondition(updatedFilter);
        break;
      case "classType":
        setSelectedType(updatedFilter);
        break;
    }
    setCurrentPage(1);
  };

  const filterBooks = books.filter((book) => {
    const matchedCondition =
      selectedCondition.length === 0 ||
      selectedCondition
        .map((cond) => cond.toLowerCase())
        .includes(book.condition.toLowerCase());
    const matchedCategory =
      selectedCategory.length === 0 ||
      selectedCategory
        .map((cat) => cat.toLowerCase())
        .includes(book.category.toLowerCase());
    const matchedType =
      selectedType.length === 0 ||
      selectedType
        .map((type) => type.toLowerCase())
        .includes(book.classType.toLowerCase());

    const searchMatch = searchTerms ? book.title.toLowerCase().includes(searchTerms.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerms.toLowerCase()) || 
    book.subject.toLowerCase().includes(searchTerms.toLowerCase()) || 
    book.category.toLowerCase().includes(searchTerms.toLowerCase()) : true;    

    return matchedCondition && matchedCategory && matchedType && searchMatch;
  });

  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-low":
        return a.finalPrice - b.finalPrice;
      case "price-high":
        return b.finalPrice - a.finalPrice;
      default:
        return 0;
    }
  });

  const totalPage = Math.ceil(sortedBooks.length / bookPerPage);
  
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            {" "}
            Home{" "}
          </Link>
          <span>/</span> <span>Books</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold">
          {" "}
          Find from over 1000s of used books online{" "}
        </h1>

        <div className="grid gap-8 md:grid-cols-[280px_2fr]">
          <div className="space-y-6">
            <Accordion
              type="multiple"
              className="bg-white p-6 border rounded-lg"
            >
              {Object.entries(filters).map(([key, values]) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-lg font-semibold text-blue-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      {values.map((value) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={value}
                            checked={
                              key === "condition"
                                ? selectedCondition.includes(value)
                                : key === "classType"
                                ? selectedType.includes(value)
                                : selectedCategory.includes(value)
                            }
                            onCheckedChange={() => togglefilter(key, value)}
                          />

                          <label
                            htmlFor={value}
                            className="text-sm font-medium leading-none"
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <>
                <div className="flex justify-between">
                  <div className="mb-8 text-xl font-semibold">
                    Buy Second Hand Books , Used Books Online In India
                  </div>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBooks.map((book) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="group relative overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl bg-white border-0">
                        <CardContent className="p-0">
                          <Link href={`/books/${book._id}`}>
                            <div className="relative">
                              <Image
                                src={book.images[0]}
                                alt={book.title}
                                width={400}
                                height={300}
                                className="h-[250px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-2">
                                {calculateDiscount(
                                  book.price,
                                  book.finalPrice
                                ) > 0 && (
                                  <Badge className="bg-red-500 text-white hover:bg-red-700">
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice
                                    )}
                                    % OFF
                                  </Badge>
                                )}
                              </div>

                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1 z-10"
                              >
                                <Heart className="h-5 w-5 text-gray-500 backdrop-blur transition-colors duration-300 group-hover:text-red-500" />
                              </Button>
                            </div>

                            <div className="p-4 space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-orange-500 line-clamp-2">
                                  {book.title}
                                </h3>
                              </div>
                              <p className="text-sm text-zinc-400">
                                {book.author}
                              </p>

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

                              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                <span>
                                  {format(
                                    new Date(book.createdAt),
                                    "dd MM yyyy"
                                  )}
                                </span>
                                <span>{book.condition}</span>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <NoData
                imageUrl="/images/no-book.jpg"
                message="No books available please try later."
                description="Try adjusting your filters or search criteria to find what you're looking for."
                onClick={() => router.push("/book-sell")}
                buttonText="Shell Your First Book"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
