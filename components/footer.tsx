"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoSrc =
    resolvedTheme === "dark" ? "/Hyundai_logo_dark.png" : "/Hyundai_logo.png";

  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-3 py-10">
      <p>Planning & Service Marketing</p>
      <Image
        src={logoSrc}
        alt="Hyundai Logo"
        width={50}
        height={50}
        className="w-[100px] h-auto"
        priority
      />
    </footer>
  );
}
