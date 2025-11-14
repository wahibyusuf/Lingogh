import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat as GeminiChat } from "@google/genai";
import { startChat, sendMessage } from '../services/geminiService';
import { Message } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, SparklesIcon, LinkIcon } from './icons/Icons';

interface ChatProps {
    language: string;
}

const Chat: React.FC<ChatProps> = ({ language }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<GeminiChat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChat = useCallback(() => {
        try {
            chatRef.current = startChat(language);
            setMessages([]);
            setIsLoading(true);
            sendMessage(chatRef.current, `Hello! Start our first ${language} lesson.`).then(response => {
                setMessages(prev => [...prev, { id: self.crypto.randomUUID(), text: response.text, sender: 'ai', sources: response.sources }]);
                setIsLoading(false);
            });
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setMessages([{id: self.crypto.randomUUID(), text: "Failed to connect to the tutor. Please check your API key.", sender: 'ai'}]);
        }
    }, [language]);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: Message = { id: self.crypto.randomUUID(), text: input, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        if (chatRef.current) {
            const response = await sendMessage(chatRef.current, input);
            const newAiMessage: Message = { id: self.crypto.randomUUID(), text: response.text, sender: 'ai', sources: response.sources };
            setMessages(prev => [...prev, newAiMessage]);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-100">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -50}}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`p-2 rounded-full ${msg.sender === 'ai' ? 'bg-blue-600' : 'bg-slate-300'} text-white flex-shrink-0 mx-2`}>
                                    {msg.sender === 'ai' ? <SparklesIcon className="w-5 h-5"/> : <div className="w-5 h-5"/>}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-slate-200">
                                            <h4 className="text-xs font-semibold text-slate-500 mb-1">Sources:</h4>
                                            <div className="flex flex-col space-y-1">
                                            {msg.sources.map(source => (
                                                <a key={source.uri} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                   <LinkIcon className="w-3 h-3"/> <span>{source.title}</span>
                                                </a>
                                            ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                             <div className="flex items-start max-w-xs">
                                <div className="p-2 rounded-full bg-blue-600 text-white flex-shrink-0 mx-2">
                                    <SparklesIcon className="w-5 h-5"/>
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white text-slate-800 shadow-sm flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150 mx-1"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-grow p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="p-3 bg-blue-600 text-white rounded-xl disabled:bg-blue-300 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <PaperAirplaneIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;