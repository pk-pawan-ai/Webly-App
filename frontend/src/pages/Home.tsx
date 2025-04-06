import { SparkleIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home(){

    const [textareaValue, setTextareaValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (isLoading || !textareaValue.trim()) return; // if already loading then returns nothing.
        try {
            console.log(`Submitting the value ${textareaValue}`);
            setIsLoading(true); // if not then load it.
            navigate('/workspace', {
                state : { 
                    userPrompt: textareaValue
                }
            }); // redirects to build after sending the request
        } catch (error) {
            console.error('Error sending prompt:', error);
        } finally {
            setIsLoading(false); // stop the loading 
        }
    }

    const handelTextareaValueChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setTextareaValue(e.target.value);
    }

    return (
        <section>
            <div className="h-screen bg-slate-900 width-full">
                <div>
                    <div className="flex justify-center text-3xl text-amber-50 font-bold font-mono py-4 pt-55">
                        Your Code, Our Tech !
                    </div>
                    <div className="flex justify-center">
                        <Input 
                            ids={1} 
                            placeholder={`var1`} 
                            onChange={handelTextareaValueChange}
                        />
                    </div>
                    <div className="flex justify-center pt-2.5">
                        <Button onClick={handleSubmit} variant={`primary`} text="Generate" startIcon={<SparkleIcon className="w-4"/>}/>
                    </div>
                </div>
            </div>
        </section>
    );
}