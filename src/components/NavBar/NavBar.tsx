"use client";
import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import CustomImage from './to-do-list.png'
import Image from "next/image";
import { SVGProps } from "react";

export default function Component() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check sessionStorage on initial render
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token); // If token exists, set as authenticated
  }, []); // Only runs once when component mounts

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false); // Set to false on logout
    router.push("/signup"); // Redirect after logout
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-custome shadow-custom">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <Image src={CustomImage} alt="Custom Icon" width={24} height={24} className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            {isAuthenticated ? (
              <> <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 border-2 border-black"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 border-2 border-black"
                  prefetch={false}
                >
                  Sign Up
                </Link>
                <Link
                  href="/signin"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900  border-2 border-black"
                  prefetch={false}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <Image src={CustomImage} alt="Custom Icon" width={24} height={24} className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>

      <nav className="ml-auto hidden lg:flex gap-6">
        {isAuthenticated ? (
          <>
       
            <Button
              onClick={handleLogout}
              variant="outline"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900  border-2 border-black"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 border-2 border-black"
              prefetch={false}
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900  border-2 border-black"
              prefetch={false}
            >
              Sign In
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
