import React from 'react'
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { PiShirtFoldedLight } from "react-icons/pi";
import { FcMissedCall } from "react-icons/fc";

const trustData = [
  { icon: LiaShippingFastSolid, text: "Free Shipping" },
  { icon: BiArrowBack, text: "Easy Returns" },
  { icon: MdOutlinePayments, text: "100% Secure Payments" },
  { icon: PiShirtFoldedLight, text: "Quality Products" },
  { icon: FcMissedCall, text: "24/7 Support" }
];

export default function TrustBuilding() {
  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-black">
      <div className="flex animate-scroll gap-6 p-6">
        {[...trustData, ...trustData].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-green-900 font-extralight md:min-w-[150px]  "
            >
              <Icon className="md:text-2xl text-xl lg:text-3xl" />
              <span className="text-center mt-2 md:text-md text-xs lg:text-lg">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}
