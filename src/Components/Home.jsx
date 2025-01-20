import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white">
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden px-8">
        <section className="z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6">
          <Button
            className="h-9 overflow-hidden border-1 border-gray-300 bg-gray-100 px-[18px] py-2 text-small font-normal leading-5 text-gray-700"
            endContent={
              <Icon
                className="flex-none outline-none [&>path]:stroke-[2]"
                icon="solar:arrow-right-linear"
                width={20}
              />
            }
            radius="full"
            variant="bordered"
          >
            New onboarding experience
          </Button>
          <div className="text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]">
            <div className="bg-hero-section-title bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Easiest way to <br /> power global teams.
            </div>
          </div>
          <p className="text-center font-normal leading-7 text-gray-700 sm:w-[466px] sm:text-[18px]">
            Acme makes running global teams simple. HR, Payroll, International
            Employment, contractor management and more.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              className="h-10 w-[163px] bg-blue-500 px-[16px] py-[10px] text-small font-medium leading-5 text-white"
              radius="full"
            >
              Get Started
            </Button>
            <Button
              className="h-10 w-[163px] border-1 border-gray-300 px-[16px] py-[10px] text-small font-medium leading-5"
              endContent={
                <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gray-300">
                  <Icon
                    className="text-gray-700 [&>path]:stroke-[1.5]"
                    icon="solar:arrow-right-linear"
                    width={16}
                  />
                </span>
              }
              radius="full"
              variant="bordered"
            >
              See our plans
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
