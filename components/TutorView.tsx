import React, { useState } from 'react';
import Chat from './Chat';
import DailyPlanComponent from './DailyPlan';
import ImageGenerator from './ImageGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, LightBulbIcon, ArrowLeftIcon } from './icons/Icons';

interface TutorViewProps {
    language: string;
    onBack: () => void;
}

type Tab = 'chat' | 'plan' | 'creative';

const TutorView: React.FC<TutorViewProps> = ({ language, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                return <Chat key="chat" language={language} />;
            case 'plan':
                return <DailyPlanComponent key="plan" language={language} />;
            case 'creative':
                return <ImageGenerator key="creative" language={language} />;
            default:
                return null;
        }
    };
    
    const tabs = [
        { id: 'chat', label: 'Tutor Chat', icon: <ChatBubbleLeftRightIcon className="w-6 h-6"/> },
        { id: 'plan', label: 'Daily Plan', icon: <ClipboardDocumentListIcon className="w-6 h-6"/> },
        { id: 'creative', label: 'Creative Practice', icon: <LightBulbIcon className="w-6 h-6"/> },
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-100">
            <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-700"/>
                </button>
                <h1 className="text-xl font-bold text-slate-800">Practicing {language}</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-grow overflow-y-auto relative">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <nav className="flex justify-around p-2 bg-white border-t border-slate-200 shadow-t-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        {tab.icon}
                        <span className="text-xs font-medium mt-1">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                className="absolute bottom-0 h-1 bg-blue-600 w-16"
                                layoutId="underline"
                            />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TutorView;