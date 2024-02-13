import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false });

export default function AnimatedBackground() {
  return (
    <div className="h-screen absolute">
      <div className="absolute w-screen h-screen z-10 bg-black">
        {typeof window !== "undefined" && (
          <ParticlesBg type="cobweb" num={100} color="#CDE1EE" />
        )}
      </div>
    </div>
  );
}

