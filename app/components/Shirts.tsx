"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const shirtsData = [
  "/Shirts/1.jpeg",
  "/Shirts/2.jpeg",
  "/Shirts/3.jpeg",
  "/Shirts/4.jpeg",
  "/Shirts/5.jpeg",
  "/Shirts/6.jpeg",
  "/Shirts/7.jpeg",
];

const Shirts = () => {
  const [index, setIndex] = useState(0);
  const animValue = useRef({ value: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const animation = gsap.to(animValue.current, {
      value: shirtsData.length - 1,
      duration: 5,
      ease: "linear",
      repeat: -1,
      onUpdate: () => {
        setIndex(Math.round(animValue.current.value));
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = shirtsData[index];
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [index]);

  return <canvas ref={canvasRef} className="h-[18rem] wd-[18rem]"></canvas>;
};

export default Shirts;
