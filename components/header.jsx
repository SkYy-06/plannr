import Image from "next/image";
import React from "react";
import Link from "next/link";

const Header =() => {
  return (
    <>
      <nav className="fixed left-0 top-0 right-0 bg-background/80 backdrop-blur-xl z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href = {"/"} className = "flex items-center">
          <Image src = "/plannr.png"  alt= "Plannr logo" width = {500} height={500} 
          className="w-full h-20" priority/>
          </Link>



          {/* Search & Location - Desktop Only */}

          {/* Right Side Actions */}


        </div>
        {/* Mobile Search & Location - Below Header */}
      </nav>
      {/* Modals */}
    </>
  );
}

export default Header;
