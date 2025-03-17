import { Button } from "../components/Button";

export const Hero = () => {
    return (
        <div>
            <div className="pt-50">
                <div className="flex flex-wrap justify-center items-center text-4xl md:text-5xl pl-3">
                    <div>
                        What do you want to build?
                    </div>
                </div>
                <div className="flex justify-center items-center md:text-lg text-sm pt-0.5 text-gray-400">
                    <div>
                        Prompt, run, edit and deploy full-stack web applications
                    </div>
                </div>
                <div className="flex justify-center items-center pt-10">
                    <span className="bg-gray-700 rounded-lg">
                        <input className="py-12 px-23" type="text" placeholder="How can webly help you today ?" />
                    </span>
                    <span>
                        <Button variant="primary" text="Generate" />
                    </span>
                </div>
            </div>
        </div>
    );
}