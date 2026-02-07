import Image from "next/image";

import Hero from "@/sections/Hero";
import Background from "@/components/Scenes/Background";
import HowWeWork from "@/sections/HowWeWork";
import WhatWeAreNot from "@/sections/WhatWeAreNot";
import BeachScene from "@/components/Scenes/BeachScene";
import Partners from "@/sections/Partners";
import Match from "@/sections/Match";
import Testimonials from "@/sections/Testimonials";
import Line from "@/components/Scenes/Line/Index";

export default function Home() {
  return (
    <>
      <Background />
      {/* <Line /> */}
      <Hero />
      <HowWeWork />
      <WhatWeAreNot />
      <BeachScene>
          <div className="h-dvh w-full pointer-none"></div>
          <Partners />
      </BeachScene>
      <Match />
      <Testimonials />
    </>
  );
}
