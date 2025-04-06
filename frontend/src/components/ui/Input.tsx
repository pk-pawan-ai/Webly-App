import { InputProps, placeholderObjsTypes } from "../../types/types";

const placeholderObjs : placeholderObjsTypes = {
    var1: "What do you want to build ?",
    var2 : "Continue your chat....."
}

const idSection = {
    1 : "block p-2.5 w-lg text-lg text-gray-200 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    2 : "block p-2.5 w-60 text-sm text-gray-200 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
}

export function Input({ids, placeholder, onChange} : InputProps) {
    return (
        <textarea 
            className={`${idSection[ids]}`} 
            placeholder={`${placeholderObjs[placeholder]}`}
            onChange={onChange}
        />
    );
}