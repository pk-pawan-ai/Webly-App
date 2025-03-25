import { useLocation } from "react-router";
import { parseAIOutput } from "../XMLparser";
import { useEffect, useRef } from "react";


export function Build(){
    const location = useLocation();
    // Get both userPrompt and aiOutput from navigation state
    const userPrompt = location.state?.userPrompt || "";
    const aiOutput = location.state?.aiOutput || null;
    const hasProcessed = useRef<boolean>(false); // using ref to stop double logs by strictmode of react

    // Process aiOutput when component mounts
    useEffect(() => {
        if (aiOutput && !hasProcessed.current) {
            const fileSystemData = parseAIOutput(aiOutput);
            console.log('Parsed output:', fileSystemData);
            hasProcessed.current = true;
        }
    }, [aiOutput])

    return (
        <>
            <div>
                <textarea placeholder="chat with webly" className="outline-2  bg-gray-200 m-4" value={userPrompt} readOnly/>
                <button className="outline-2 my-5 cursor-pointer" type="button">
                    Generate
                </button>
            </div>
        </>
    );
};