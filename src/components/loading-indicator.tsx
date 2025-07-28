import { motion } from "framer-motion";
import Image from "next/image"

export const LoadingIndicator: React.FC = () => {

    return (
        <div className="flex flex-row gap-3 items-end">
            <motion.div
                className="bg-gradient-to-r from-[#0C4A4D] to-[#083032] text-[#FFFFFF]
                ms-auto rounded-2xl shadow-lg p-4 max-w-[75%]
                border border-[#1F5A5C] relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    className="absolute inset-0 bg-white/10 blur-md"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Typing Animation */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex space-x-1">
                        <motion.div
                            className="h-2 w-2 bg-white rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0,
                            }}
                        />
                        <motion.div
                            className="h-2 w-2 bg-white rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.2,
                            }}
                        />
                        <motion.div
                            className="h-2 w-2 bg-white rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.4,
                            }}
                        />
                    </div>

                    {/* <div className="flex items-center gap-2">
                        <p className="text-xs">thinking...</p>
                    </div> */}
                </div>
            </motion.div>

            <motion.div
                className="mb-2 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                {/* <div className="rounded-full bg-gradient-to-r from-[#0C4A4D] to-[#083032] shadow-md relative z-10"> */}
                    <Image src="/assets/logo.svg" alt="chat icon" width={24} height={24}  />
                {/* </div> */}
                <motion.div
                    className="absolute inset-0 w-7 h-7 rounded-full bg-white/20 blur-sm"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            </motion.div>
        </div>
    );
};
