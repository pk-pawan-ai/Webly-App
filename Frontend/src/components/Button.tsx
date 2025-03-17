import { ReactNode } from "react";

interface ButtonProps{
    variant : "primary";
    startIcon ?: ReactNode;
    endIcon ?: ReactNode;
    text : string;
}

const variants = {
    "primary" : "bg-gray-800 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 cursor-pointer py-3 px-4 rounded-lg ml-2 flex",
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