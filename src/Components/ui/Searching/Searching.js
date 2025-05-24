"use client";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
// import SearchInput from "@/components/SearchInput";
import SearchInput from "@/Components/ui/SearchInput/SearchInput";

export default function Searching() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center pl-[10px]">
        {/* <input
          type="text"
          placeholder="Search your notes..."
          className="border p-2 rounded-l-3xl md:w-[350px] sm:w-[150px] w-[90px] h-[34px] relative z-10 focus:outline-none focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[15px] border-black text-black"
        /> */}
        <SearchInput />
        <div className="bg-[#020202] border-black border-1 py-[4px] px-[8px] rounded-r-3xl cursor-pointer">
          <Search className=" text-white pr-[5px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center pl-[10px]">
      {/* <input
        type="text"
        placeholder="Search your notes..."
        className={`border p-2 rounded-l-3xl md:w-[350px] sm:w-[150px] w-[90px] h-[34px] relative z-10 focus:outline-none focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[15px] ${
          theme === "dark"
            ? "border-white text-white"
            : "border-black text-black"
        }`}
      /> */}
      <SearchInput />
      <div className="bg-[#020202] border-black border-1 py-[4px] px-[8px] rounded-r-3xl cursor-pointer">
        <Search className=" text-white pr-[5px]" />
      </div>
    </div>
  );
}
