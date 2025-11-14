
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon, SparklesIcon } from './icons/Icons';

interface ImageGeneratorProps {
    language: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ language }) => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        const result = await generateImage(prompt);
        if (result) {
            setImageUrl(result);
        } else {
            setError('Could not generate image. Please try another prompt.');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4 md:p-6 h-full overflow-y-auto bg-slate-100">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Creative Practice</h2>
                    <p className="text-slate-500">Visualize your new vocabulary! Describe a scene in {language} and see it come to life.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="flex flex-col space-y-3">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={`e.g., "un gato grande con un sombrero rojo"`}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5"/> Generate Image
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 text-center bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </motion.div>
                )}

                {imageUrl && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 aspect-square bg-white p-2 rounded-xl shadow-lg">
                        <img src={imageUrl} alt={prompt} className="w-full h-full object-cover rounded-lg" />
                    </motion.div>
                )}

                {!isLoading && !imageUrl && !error && (
                    <div className="mt-6 text-center text-slate-400 p-8 border-2 border-dashed border-slate-300 rounded-xl">
                        <PhotoIcon className="w-16 h-16 mx-auto mb-2"/>
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
                 </AnimatePresence>
            </div>
        </div>
    );
};

export default ImageGenerator;
