import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Shield, Code2 } from 'lucide-react';

const LANDING_DURATION_MS = 3500;

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);

    // Matrix rain effect characters
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    // Timer logic + Progress Bar simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        // Random glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 100);
        }, 800);

        const timeout = setTimeout(() => {
            navigate('/login', { replace: true });
        }, LANDING_DURATION_MS);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
            clearInterval(glitchInterval);
        };
    }, [navigate]);

    // Matrix rain columns
    const MatrixRain = () => {
        const columns = 20;
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                {[...Array(columns)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-cyber-cyan text-xs font-mono"
                        style={{ left: `${(i / columns) * 100}%` }}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ 
                            y: '100vh', 
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'linear'
                        }}
                    >
                        {[...Array(20)].map((_, j) => (
                            <div key={j}>
                                {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>
        );
    };

    // Floating particles
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono relative overflow-hidden">
            
            {/* Enhanced Background Effects */}
            <div className="scanlines" />
            <MatrixRain />
            <FloatingParticles />
            
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f3ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
            
            {/* Radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-50" />
            
            {/* Pulsing corner accents */}
            <motion.div 
                className="absolute top-0 left-0 w-64 h-64 bg-cyber-cyan/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
                className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />

            <AnimatePresence>
                <motion.div
                    className="z-10 text-center space-y-8 max-w-2xl w-full p-6 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Top decorative border */}
                    <motion.div 
                        className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    />

                    {/* Enhanced Icon Animation with orbit */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex justify-center relative"
                    >
                        {/* Orbiting elements */}
                        <motion.div
                            className="absolute"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap className="w-6 h-6 text-cyber-cyan/40" style={{ transform: 'translateX(60px)' }} />
                        </motion.div>
                        <motion.div
                            className="absolute"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <Shield className="w-5 h-5 text-red-500/40" style={{ transform: 'translateX(-60px)' }} />
                        </motion.div>
                        <motion.div
                            className="absolute"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        >
                            <Code2 className="w-4 h-4 text-cyber-cyan/30" style={{ transform: 'translateY(-60px)' }} />
                        </motion.div>

                        {/* Central icon */}
                        <div className="relative">
                            <motion.div 
                                className="absolute inset-0 bg-cyber-cyan blur-2xl opacity-40"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                animate={{ 
                                    boxShadow: [
                                        '0 0 20px #00f3ff',
                                        '0 0 40px #00f3ff',
                                        '0 0 20px #00f3ff'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="relative z-10 p-4 rounded-lg border-2 border-cyber-cyan/50 bg-black/50 backdrop-blur-sm"
                            >
                                <Terminal className="w-16 h-16 text-cyber-cyan" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced Logo with better glitch effect */}
                    <div className="relative">
                        <motion.h1 
                            className={`font-orbitron text-5xl md:text-7xl font-black tracking-widest text-white relative inline-block ${glitchActive ? 'glitch-active' : ''}`}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 10 }}
                        >
                            {/* Multiple glitch layers for depth */}
                            <span className="absolute -inset-1 text-cyber-red opacity-70 blur-[2px] animate-glitch-1" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}>
                                CODE RONIN
                            </span>
                            <span className="absolute -inset-1 text-cyber-cyan opacity-70 blur-[2px] animate-glitch-2" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}>
                                CODE RONIN
                            </span>
                            <span className="absolute -inset-1 text-cyber-red opacity-40 blur-sm ml-1 -mt-1">
                                CODE RONIN
                            </span>
                            <span className="absolute -inset-1 text-cyber-cyan opacity-40 blur-sm -ml-1 mt-1">
                                CODE RONIN
                            </span>
                            <span className="relative drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                                CODE <span className="text-cyber-cyan">RONIN</span>
                            </span>
                        </motion.h1>
                        
                        {/* Animated subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 space-y-2"
                        >
                            <p className="text-cyber-dim text-sm tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <Cpu className="w-4 h-4" />
                                </motion.div>
                                System Initialization
                            </p>
                            <motion.p 
                                className="text-cyber-cyan/60 text-xs tracking-wider"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0.7] }}
                                transition={{ delay: 0.8, duration: 1 }}
                            >
                                THE ONLY CODING PLATFORM THAT FIGHTS BACK
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Enhanced Loader Bar with segments */}
                    <div className="space-y-2">
                        <div className="relative w-full bg-black/50 border-2 border-cyber-cyan/30 h-4 rounded-sm overflow-hidden backdrop-blur-sm">
                            {/* Background segments */}
                            <div className="absolute inset-0 flex">
                                {[...Array(20)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="flex-1 border-r border-cyber-cyan/10"
                                    />
                                ))}
                            </div>
                            
                            {/* Progress fill with animated gradient */}
                            <motion.div 
                                className="h-full relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-cyan bg-[length:200%_100%] animate-gradient-flow shadow-[0_0_20px_#00f3ff]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                            </motion.div>

                            {/* Scanning line */}
                            {progress < 100 && (
                                <motion.div
                                    className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_10px_#fff]"
                                    animate={{ left: ['0%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            )}
                        </div>
                        
                        {/* Percentage display */}
                        <div className="flex justify-between text-xs text-cyber-cyan/60 font-mono">
                            <span>LOADING...</span>
                            <motion.span
                                key={progress}
                                initial={{ scale: 1.2, color: '#00f3ff' }}
                                animate={{ scale: 1, color: '#00f3ff99' }}
                            >
                                {progress}%
                            </motion.span>
                        </div>
                    </div>

                    {/* Enhanced Terminal Output with typewriter effect */}
                    <motion.div 
                        className="relative h-24 text-xs text-left font-mono space-y-1 overflow-hidden bg-black/30 border border-cyber-cyan/20 rounded p-3 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Terminal header */}
                        <div className="flex items-center gap-2 mb-2 pb-1 border-b border-cyber-cyan/20">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/80" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                                <div className="w-2 h-2 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-cyber-dim text-[10px]">SYSTEM.LOG</span>
                        </div>

                        {/* Terminal content */}
                        <motion.p 
                            className="text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-cyber-cyan">{'>'}</span> Connecting to Pyodide Runtime...
                        </motion.p>
                        
                        {progress > 30 && (
                            <motion.p 
                                className="text-gray-500"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="text-cyber-cyan">{'>'}</span> Loading Neural Saboteur Models...
                            </motion.p>
                        )}
                        
                        {progress > 60 && (
                            <motion.p 
                                className="text-cyber-cyan"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="text-white">{'>'}</span> ESTABLISHING SECURE CONNECTION...
                                <motion.span
                                    animate={{ opacity: [0, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    _
                                </motion.span>
                            </motion.p>
                        )}
                        
                        {progress > 90 && (
                            <motion.p 
                                className="text-green-500 font-bold"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <span className="text-green-400">{'>'}</span> ACCESS GRANTED.
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                    ✓
                                </motion.span>
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Bottom decorative border */}
                    <motion.div 
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </motion.div>
            </AnimatePresence>

            <style>{`
                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                
                .animate-gradient-flow {
                    animation: gradient-flow 2s linear infinite;
                }

                @keyframes glitch-1 {
                    0%, 100% { transform: translate(0); }
                    33% { transform: translate(-2px, 2px); }
                    66% { transform: translate(2px, -2px); }
                }

                @keyframes glitch-2 {
                    0%, 100% { transform: translate(0); }
                    33% { transform: translate(2px, -2px); }
                    66% { transform: translate(-2px, 2px); }
                }

                .animate-glitch-1 {
                    animation: glitch-1 0.3s infinite;
                }

                .animate-glitch-2 {
                    animation: glitch-2 0.3s infinite;
                }

                .glitch-active .animate-glitch-1,
                .glitch-active .animate-glitch-2 {
                    animation-duration: 0.1s;
                }
            `}</style>
        </div>
    );
};

export default Landing;