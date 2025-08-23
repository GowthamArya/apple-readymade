"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { IoShirtSharp } from 'react-icons/io5';
import { PiShirtFoldedFill,PiPantsFill } from 'react-icons/pi';
import { GiClothes } from 'react-icons/gi';
import { FaHatCowboySide } from 'react-icons/fa';
import { LiaAppleAltSolid } from 'react-icons/lia';

const icons = [IoShirtSharp, PiShirtFoldedFill, PiPantsFill, GiClothes, FaHatCowboySide, LiaAppleAltSolid];

export default function Loader(): any {
    const animValue = useRef({ value: 0 });
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const animation = gsap.to(animValue.current, {
            value: icons.length - 1,
            duration: 2,
            ease: "linear",
            repeat: -1,
            onUpdate: () => {
                setIndex(Math.floor(animValue.current.value));
            },
        });
        return () => {
            animation.kill();
        };
    }, []);

    const IconComponent = icons[index];

    return (
        <div className="fixed inset-0 bg-white dart:bg-black bg-opacity-50 flex flex-col justify-center items-center z-100 dark:text-green-50">
            <IconComponent size={50} />
            <p className='font-bold text-xs'>Please wait</p>
        </div>
    );
}