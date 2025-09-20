'use client';

import { IconType } from "react-icons";

export class ButtonProps {
  onClickFunction: any;
  functionProps?: any;
  classNames?: string;
  icon!: IconType;
}

export default function IconButton(buttonProps: ButtonProps) {
  return (
    <buttonProps.icon 
        onClick={() => buttonProps.onClickFunction(buttonProps.functionProps)} 
        className={buttonProps.classNames}>
    </buttonProps.icon >
);
}