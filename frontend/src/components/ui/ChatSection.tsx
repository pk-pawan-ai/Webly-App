import { Input } from "./Input";
import { Button } from "./Button";
import { ChatSectionProps } from "../../types/types";

const ChatSection = ({aiResponse, isLoading} : ChatSectionProps) => {

  // Split the response into individual steps
  const steps = aiResponse?.split('✓')
    .filter(step => step.trim()) // Remove empty strings
    .map(step => step.trim());

  return (
    <div className="flex flex-col w-[25%] h-[100vh] bg-[#1E1E2F] text-white p-4 overflow-auto border-r border-gray-700">
      <div className="text-lg mb-4 font-semibold">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {isLoading ? (
              <div className="bg-[#2D2D44] p-3 rounded-md text-sm animate-pulse">
                Loading...
              </div>
            ) : steps ? (
              <>
                <div className="bg-[#2D2D44] p-3 rounded-md text-sm font-semibold border-l-4 border-blue-500">
                  Creating files:
                </div>
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="bg-[#2D2D44] p-3 rounded-md text-sm flex items-center space-x-2 hover:bg-[#363652] transition-colors duration-200"
                  >
                    <span className="text-green-400">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </>
            ) : null}
        </div>
      </div>
        
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input ids={2} placeholder={`var2`}/>
        </div>
        <div className="flex-shrink-0">
          <Button variant={"secondary"} text="Go"/>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;