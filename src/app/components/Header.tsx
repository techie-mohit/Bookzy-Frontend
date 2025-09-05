"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import {
  BookLock,
  ChevronRight,
  FileText,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  Search,
  ShoppingCart,
  User,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./AuthPage";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";
import { setCart } from "@/store/slice/cartSlice";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );

  const user = useSelector((state:RootState)=> state.user.user );
  const [logoutMutation] = useLogoutMutation();
  console.log(user);
  const userPlaceholder = user?.name?.split(" ").map((name:string) => name[0]).join("");
  const cartItemCount = useSelector((state: RootState)=> state.cart.items.length);
  const {data:cartData} = useGetCartQuery(user?._id, {skip:!user});

  const [searchTerms, setSearchTerms] = useState("");
  const handleSearch = ()=>{
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`);
  }



  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  useEffect(()=>{
    if(cartData?.successful && cartData?.data){
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleProtectionClick = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };

  const handleLogoutClick = async() => {
    try{
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("Logout successful");
      setIsDropdownOpen(false);

    }catch(error){
      toast.error("Logout failed. Please try again.");
    }
  };

  const menuItems = [
    ...(user && user
      ? [
          {
            href: "account/profile",
            content: (
              <div className="flex space-x-4 items-center p-2 border-b">
                <Avatar className="w-12 h-12 -ml-2 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="user_image"></AvatarImage>
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-semibold text-md">{user?.name}</span>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icons: <Lock className="h-5 w-5" />,
            label: "Login/SignUp",
            onClick: handleLoginClick,
          },
        ]),


    {
      icons: <User className="h-5 w-5" />,
      label: "My Profile",
      onClick: () => handleProtectionClick("/account/profile"),
    },
    {
      icons: <Package className="h-5 w-5" />,
      label: "My Orders",
      onClick: () => handleProtectionClick("/account/orders"),
    },
    {
      icons: <PiggyBank className="h-5 w-5" />,
      label: "My Selling Orders",
      onClick: () => handleProtectionClick("/account/selling-orders"),
    },
    {
      icons: <ShoppingCart className="h-5 w-5" />,
      label: "My Cart",
      onClick: () => handleProtectionClick("/account/cart"),
    },
    {
      icons: <Heart className="h-5 w-5" />,
      label: "My Wishlist",
      onClick: () => handleProtectionClick("/account/wishlist"),
    },
    {
      icons: <User2 className="h-5 w-5" />,
      label: "About Us",
      href: "/account/about-us",
    },
    {
      icons: <FileText className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/account/terms-of-use",
    },
    {
      icons: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/account/privacy-policy",
    },
    {
      icons: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      href: "/account/how-it-works",
    },
    ...(user && user ?  [
      {
        icons: <LogOut className="h-5 w-5" />,
        label: "Logout",
        onClick: handleLogoutClick,
      },
    ]: []),
  ];

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems?.map((items, index) =>
        items.href ? (
          <Link
            key={index}
            href={items.href}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            {items.icons}
            <span>{items?.label}</span>
            {items?.content && <div className="mt-1">{items?.content}</div>}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
        ) : (
          <button
            key={index}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
            onClick={items.onClick}
          >
            {items.icons}
            <span>{items?.label}</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )
      )}
    </div>
  );

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Deskto Header */}
      <div className="container w-[80%] mx-auto hidden lg:flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            alt="Desktop Logo"
            width={450}
            height={100}
            className="h-15 w-auto"
          />
        </Link>

        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search for Book Name, Author, Subject and Publisher"
              className="w-full pr-10"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick = {handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 ">
          <Link href="/book-sell">
            <Button className="bg-red-600 text-gray-900 hover:bg-red-700">
              Sell Book
            </Button>
          </Link>

          {/* // for only drop down menu */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="w-8 h-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="user_image"></AvatarImage>
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 pb-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-8 w-8 mr-2" />
                Cart
              </Button>

              {user && cartItemCount > 0 &&(
                <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 px-1 text-xs text-white bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}

      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/web-logo.png"
                  alt="Desktop Logo"
                  width={150}
                  height={40}
                  className="h-15 w-auto"
                />
              </Link>
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            alt="Desktop Logo"
            width={450}
            height={100}
            className="h-6 md:h-10 w-20 md:w-auto "
          />
        </Link>

        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search Books..."
              className="w-full pr-10"
              value=""
              onChange={() => {}}
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-8 w-8 mr-2" />
              </Button>

              {user && cartItemCount > 0 && (
                <span className="absolute top-2 left-5 transform translate-x-1/2 -translate-y-1/2 px-1 text-xs text-white bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>

        
      </div>

      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
};

export default Header;
