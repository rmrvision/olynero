"use client";

import { motion } from "framer-motion";

export function DashboardHeroHeading() {
    return (
        <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                Создавайте с{" "}
            </motion.span>
            <motion.span
                className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.7,
                    delay: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                OlyneroAI
            </motion.span>
        </motion.h1>
    );
}
