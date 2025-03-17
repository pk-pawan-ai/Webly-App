import { ReactNode } from "react";

interface ButtonProps{
    variant : "primary";
    startIcon ?: ReactNode;
    endIcon ?: ReactNode;
    text : string;
}

const variants = {
    "primary" : "bg-gradient-to-r from-[#1F1C2C] via-[#928DAB] to-[#1F1C2C] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-3.5 px-4 rounded-lg ml-2.5 shadow-[0_0_20px_#eee] ",
}

export const Button = ({ text, startIcon, endIcon, variant } : ButtonProps) => {
    return (
        <button className={variants[variant]}>
            {startIcon}
            {text}
            {endIcon}
        </button>
    );
};