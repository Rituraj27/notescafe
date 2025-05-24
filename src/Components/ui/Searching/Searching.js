// "use client";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import SearchInput from "@/components/SearchInput";

export default function Searching() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center pl-[10px]">
      <SearchInput />
      <div className="bg-[#020202] border-black border-1 py-[4px] px-[8px] rounded-r-3xl cursor-pointer">
        <Search className=" text-white pr-[5px]" />
      </div>
    </div>
  );
}
