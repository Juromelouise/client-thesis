import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden px-8">
        <section className="z-20 flex flex-col items-center justify-center gap-6 sm:gap-6">
          <div className="text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]">
            <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              CLEARING THE PATH <br /> MAPPING A GOOD FUTURE
            </div>
          </div>
          <p className="text-center font-normal leading-7 text-gray-700 sm:w-[466px] sm:text-[18px]">
            It highlights the goal of improving road and street spaces while
            emphasizing the innovative approach through semantic analysis.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              className="h-10 w-[163px] bg-blue-500 px-[16px] py-[10px] text-small font-medium leading-5 text-white"
              radius="full"
              onClick={() => navigate("/FYP")}
            >
              Get Started
            </Button>
          </div>
        </section>
        <div className="pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125">
          {/* Add any background elements here if needed */}
        </div>
      </main>
    </div>
  );
}
