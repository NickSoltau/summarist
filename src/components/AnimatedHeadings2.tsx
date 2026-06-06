"use client";

import { useState, useEffect } from "react";

const headings = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

export default function AnimatedHeadings2() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % headings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="statistics__content--header statistics__content--header-second">
      {headings.map((heading, index) => (
        <div
          key={heading}
          className={`statistics__heading ${index === activeIndex ? "statistics__heading--active" : ""}`}
        >
          {heading}
        </div>
      ))}
    </div>
  );
}