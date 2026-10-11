"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  childrenSelector?: string;
};

/** Generieke scroll-reveal: fade+up als target in view komt. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  stagger,
  childrenSelector,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets =
        stagger && childrenSelector
          ? ref.current.querySelectorAll(childrenSelector)
          : [ref.current];

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay,
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
