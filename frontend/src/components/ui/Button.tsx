import { ButtonProps, variantClassesTypes } from "../../types/types";

const variantClasses : variantClassesTypes = {
    primary : "text-white text-md bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-10 py-2 text-center cursor-pointer p-1.5",
    secondary : "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-2 py-2.5 text-center me-2 mb-2 cursor-pointer"
}

export function Button({variant, startIcon, text, onClick, disabled=false} : ButtonProps) {
    return (
        <button 
        className={`${variantClasses[variant]}`}
        onClick={onClick}
        disabled={disabled}
        >
            <div className="flex justify-center items-center">
                <div>
                    {startIcon}
                </div>
                <div>
                    {text}
                </div>
            </div>
        </button>
    );
};