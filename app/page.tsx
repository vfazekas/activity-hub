import { AuthButton } from "@/components/auth/auth-button";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {


  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full px-20 flex justify-between items-center p-3 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={500}
                  height={120}
                  className="w-[150px] h-auto"
                />
              </Link>
              <div className="flex items-center gap-2"></div>
            </div>
            <div className="flex flex-row">
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 min-w-full">
          <Hero />
        </div>
        <Footer />
      </div>
    </main>
  );
}
