
import React from 'react';
import { LANGUAGES } from '../constants';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
    onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="mb-10"
            >
                <h1 className="text-6xl font-extrabold text-white tracking-tight">Lingo<span className="text-[#5D4037]">gh</span></h1>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Master a new language with your AI instructor</h2>
            <p className="text-lg text-blue-200 mb-8">Choose a language to start</p>

            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {LANGUAGES.map((lang) => (
                    <motion.button
                        key={lang.name}
                        onClick={() => onSelectLanguage(lang.name)}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-5xl mb-2">{lang.flag}</span>
                        <span className="text-lg font-semibold text-slate-800">
                            {lang.name}
                        </span>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export default LanguageSelector;
