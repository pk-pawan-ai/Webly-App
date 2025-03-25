import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../config";

export function Home(){
    
    const [textareaValue, setTextareaValue] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        if (isLoading) return; // if already loading then returns nothing.

        try {
            setIsLoading(true); // if not then load it.
            const response = await axios.post(`${BACKEND_URL}/template`, { userPrompt: textareaValue });
            navigate('/build', {
                state : { 
                    userPrompt: textareaValue,
                    aiOutput : response.data.aiOutput 
                }
            }); // Redirects to build after sending the request
        } catch (error) {
            console.error('Error sending prompt:', error);
        } finally {
            setIsLoading(false); // stop the loading 
        }
    };

    const handelTextareaValueChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    }

    return (
        <>
            <div>
                <div className="flex">
                    <textarea className="outline-2 bg-gray-200 m-4" name="chatAI" placeholder="what do u want to build" onChange={handelTextareaValueChange}/>
                    <button className="outline-2 p-1 mt-2 cursor-pointer" onClick={handleSubmit}>
                        {isLoading ? "Sending to BE...." : "Submit"}
                    </button>
                </div>
            </div>
        </>
    );
};