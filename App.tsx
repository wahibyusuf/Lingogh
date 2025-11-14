
import React, { useState, useCallback } from 'react';
import LanguageSelector from './components/LanguageSelector';
import TutorView from './components/TutorView';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    const handleLanguageSelect = useCallback((language: string) => {
        setSelectedLanguage(language);
    }, []);

    const handleBack = useCallback(() => {
        setSelectedLanguage(null);
    }, []);

    return (
        <div className="w-full h-screen font-sans text-slate-900 bg-blue-600">
            <AnimatePresence mode="wait">
                {!selectedLanguage ? (
                    <motion.div
                        key="selector"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LanguageSelector onSelectLanguage={handleLanguageSelect} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="tutor"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <TutorView language={selectedLanguage} onBack={handleBack} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
