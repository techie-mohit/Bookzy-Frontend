"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { books, filters } from "@/lib/Constant";
import Link from "next/link";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import BookLoader from "@/lib/BookLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  const bookPerPage = 6; // Number of books to display per page

  const [isLoading, setIsLoading] = useState(false);

  const togglefilter = (section: string, item: string) => {
    const updatedFilter = (prev: string[]) => {
      return prev.includes(item) ? prev.filter((i) => i != item) : [...prev, item];
    };

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

    return matchedCondition && matchedCategory && matchedType;
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

  const totalPage = Math.ceil(sortedBooks.length/ bookPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * bookPerPage,
    currentPage * bookPerPage
  );
  const handlePageChange = (page : number)=>{
    setCurrentPage(page);
  }
  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formData = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {addSuffix: true});
  };



  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            {" "}Home{" "}
          </Link>
          <span>/</span> <span>Books</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold">
          {" "} Find from over 1000s of used books online {" "}
        </h1>

        <div className="grid gap-8 md:grid-cols-[280px_2fr]">
          <div className="space-y-6">
            <Accordion type="multiple" className="bg-white p-6 border rounded-lg">

              {Object.entries(filters).map(([key, values])=>(
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-lg font-semibold text-blue-500">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      {
                        values.map((value)=> (
                          <div key={value} className="flex items-center space-x-2">
                            <Checkbox 
                            id={value}
                            checked = {key === 'condition' ? selectedCondition.includes(value)
                              : key === 'classType' ? selectedType.includes(value)
                              : selectedCategory.includes(value)}

                              onCheckedChange = {()=> togglefilter(key, value)}
                          />

                          <label htmlFor={value} className="text-sm font-medium leading-none">{value}</label>

                          </div>
                        ))
                      }
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className = "space-y-6">
            {
              isLoading ? (
                <BookLoader/>
              ):(
                paginatedBooks.length ? (
                  <>
                    <div className="flex justify-between">
                      <div className="mb-8 text-xl font-semibold">Buy Second Hand Books , Used Books Online In India</div>
                        <Select value={sortOption} onValueChange={setSortOption}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </>  

                ):false
              )
              
            }
        </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
