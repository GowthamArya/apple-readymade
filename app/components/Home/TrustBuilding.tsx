import React from 'react'
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdOutlinePayments } from "react-icons/md";
import { PiShirtFoldedLight } from "react-icons/pi";
import { MdSupportAgent  } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";


const trustData = [
  { icon: LiaShippingFastSolid, text: "Free Shipping" },
  { icon: RiArrowGoBackLine, text: "Easy Returns" },
  { icon: MdOutlinePayments, text: "100% Secure" },
  { icon: PiShirtFoldedLight, text: "Quality Products" },
  { icon: MdSupportAgent , text: "24/7 Support" }
];

export default function TrustBuilding() {
  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex md:justify-evenly gap-4 md:p-5 p-2">
        {[...trustData].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-green-950 dark:text-green-100 font-extralight md:min-w-[150px]  "
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
