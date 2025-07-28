import { FC, useState } from "react";
import DOMPurify from "dompurify";
import { AssistanceFormProps } from "../types/chat-wedgit-types";

export const AssistanceForm: FC<AssistanceFormProps> = ({ handleCloseAssistanceForm }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        query: "",
        name: "",
        company: "",
        email: "",
        datetime: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: DOMPurify.sanitize(value) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <>
            {isSubmitted ? (
                <div className="bg-[#FFFFFF] p-4 rounded-lg text-center">
                    <p className="text-[#3C3C3C] text-sm">Thank you! Your request has been submitted successfully.</p>
                    <button className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] px-3 py-1 rounded-xl text-sm mt-3 text-white" onClick={handleCloseAssistanceForm}>Close</button>
                </div>
            ) : (
                <>
                    <p className="text-[#3C3C3C] text-xs my-2 px-5">
                        I&apos;m sorry, but I don&apos;t have the answer to that right now. However, I can connect you with our team for further assistance.
                    </p>
                    <form onSubmit={handleSubmit} className="bg-[#FFFFFF] p-2 rounded-lg flex flex-col gap-2">
                        <input type="text" name="query" placeholder="Query" value={formData.query} onChange={handleChange} className="w-full p-2 border rounded text-sm text-[#676767] focus:outline-none" required />
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded text-sm text-[#676767] focus:outline-none" required />
                        <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded text-sm text-[#676767] focus:outline-none" />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded text-sm text-[#676767] focus:outline-none" required />
                        <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} className="w-full p-2 border rounded text-sm text-[#676767] focus:outline-none" required />
                        <div className="flex justify-center items-center gap-2">
                            <button type="button" className="bg-[#FFFFFF] px-3 py-1 rounded-xl border border-[#083032] text-[#083032] text-sm min-w-[70px]" onClick={handleCloseAssistanceForm}>Cancel</button>
                            <button type="submit" className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] px-3 py-1 rounded-xl text-sm min-w-[70px] text-white">Ok</button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
};
