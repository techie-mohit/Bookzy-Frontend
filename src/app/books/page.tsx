"use client";

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { books, filters } from "@/lib/Constant";
import { Key } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  const togglefilter = (section: string, item: string) => {
    const updatedFilter = (prev: string[]) => {
      prev.includes(item) ? prev.filter((i) => i != item) : [...prev, item];
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
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
