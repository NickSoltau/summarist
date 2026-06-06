"use client";

import { useState, useEffect } from "react";

const headings = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

export default function AnimatedHeadings() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % headings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="statistics__content--header">
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