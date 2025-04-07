import Searching from "@/Components/ui/Searching/Searching";
import ThemeToggle from "@/Components/ui/ThemeToggle/ThemeToggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-[#2d303c] flex items-center justify-between py-2 w-full transition-colors duration-200 relative h-[10vh] ">
      <div className="w-full flex items-center justify-between px-[3vw]">
        <div className="w-[80px] sm:w-[150px]">
          <Image
            src="/notescafe-Logo.png"
            alt="Logo"
            width="220"
            height="220"
            className=""
          />
        </div>
        <div className="flex items-center gap-[2vw]">
          <div>
            <Searching />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
