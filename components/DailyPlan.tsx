
import React, { useState, useEffect, useCallback } from 'react';
import { generateDailyPlan } from '../services/geminiService';
import { DailyPlan, DailyPlanTask } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon, DocumentPlusIcon, MicrophoneIcon, PencilSquareIcon, PlayCircleIcon } from './icons/Icons';

interface DailyPlanProps {
    language: string;
}

const TaskIcon: React.FC<{ type: DailyPlanTask['type'] }> = ({ type }) => {
    switch(type) {
        case 'listening': return <PlayCircleIcon className="w-6 h-6 text-pink-500" />;
        case 'speaking': return <MicrophoneIcon className="w-6 h-6 text-green-500" />;
        case 'writing': return <PencilSquareIcon className="w-6 h-6 text-yellow-500" />;
        default: return <DocumentPlusIcon className="w-6 h-6 text-purple-500" />;
    }
}

const DailyPlanComponent: React.FC<DailyPlanProps> = ({ language }) => {
    const [plan, setPlan] = useState<DailyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `dailyPlan_${language}_${today}`;

    useEffect(() => {
        const savedPlan = localStorage.getItem(storageKey);
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
        }
    }, [storageKey]);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        const newPlan = await generateDailyPlan(language);
        if (newPlan) {
            setPlan(newPlan);
            localStorage.setItem(storageKey, JSON.stringify(newPlan));
        }
        setIsLoading(false);
    };

    const toggleTask = (taskId: string) => {
        if (!plan) return;
        const updatedTasks = plan.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const updatedPlan = { ...plan, tasks: updatedTasks };
        setPlan(updatedPlan);
        localStorage.setItem(storageKey, JSON.stringify(updatedPlan));
    };

    const completedTasks = plan?.tasks.filter(t => t.completed).length || 0;
    const totalTasks = plan?.tasks.length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto bg-slate-100">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Your Daily {language} Plan</h2>
                    <p className="text-slate-500">A 25-minute workout to keep you on track.</p>
                </div>

                {!plan && !isLoading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 bg-white rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No plan for today yet.</h3>
                        <p className="text-slate-500 mb-4">Let Lingogh create a personalized plan for you!</p>
                        <button
                            onClick={handleGeneratePlan}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                           <SparklesIcon className="w-5 h-5"/> Generate My Plan
                        </button>
                    </motion.div>
                )}

                {isLoading && (
                    <div className="text-center p-8 text-slate-600">
                        <p>Generating your personalized plan...</p>
                    </div>
                )}
                
                <AnimatePresence>
                {plan && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-2">Progress</h3>
                            <div className="w-full bg-slate-200 rounded-full h-4">
                                <motion.div 
                                    className="bg-green-500 h-4 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-right text-sm text-slate-500 mt-1">{completedTasks} of {totalTasks} tasks completed</p>
                        </div>

                        <div className="space-y-3">
                            {plan.tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex items-center p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${task.completed ? 'bg-green-100 text-slate-500' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <div className="mr-4">
                                        <TaskIcon type={task.type} />
                                    </div>
                                    <p className={`flex-grow ${task.completed ? 'line-through' : ''}`}>
                                        {task.description}
                                    </p>
                                    <div className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                        {task.completed && <CheckCircleIcon className="w-7 h-7 text-white"/>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DailyPlanComponent;
