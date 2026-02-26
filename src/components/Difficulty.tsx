import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Skull, Zap, Flame, AlertTriangle, ShieldAlert, Swords, ChevronRight } from 'lucide-react';
import { useBackButton } from '../lib/useBackButton';

const DIFFICULTIES = [
    { 
        id: 'syntax', 
        label: 'Syntax Goblin', 
        desc: 'Beginner — missing colons, typos',
        icon: Zap,
        color: '#22c55e',
        gradient: 'from-green-500 to-emerald-500',
        threatLevel: 1,
        threats: ['Missing colons', 'Typos', 'Basic syntax errors']
    },
    { 
        id: 'logic', 
        label: 'Logic Gremlin', 
        desc: 'Intermediate — off-by-one, state bugs',
        icon: AlertTriangle,
        color: '#f59e0b',
        gradient: 'from-orange-500 to-amber-500',
        threatLevel: 2,
        threats: ['Off-by-one errors', 'State mutations', 'Logic flaws']
    },
    { 
        id: 'semantic', 
        label: 'Semantic Impostor', 
        desc: 'Advanced — subtle library misuses',
        icon: Skull,
        color: '#ef4444',
        gradient: 'from-red-500 to-rose-500',
        threatLevel: 3,
        threats: ['Library misuses', 'Subtle bugs', 'Advanced exploits']
    },
] as const;

const Difficulty: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const skill = (location.state as { skill?: string } | null)?.skill;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

    useBackButton();

    const handleDifficulty = (id: string) => {
        setSelectedDifficulty(id);
        setTimeout(() => {
            navigate('/arena', { replace: true, state: { skill, difficultyId: id } });
        }, 800);
    };

    // Floating particles background
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#f59e0b' : '#ef4444'
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                />
            ))}
        </div>
    );

    // Danger level indicator
    const ThreatIndicator = ({ level }: { level: number }) => (
        <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-6 rounded-sm"
                    style={{
                        backgroundColor: i < level 
                            ? level === 1 ? '#22c55e' 
                            : level === 2 ? '#f59e0b' 
                            : '#ef4444'
                            : '#1f2937'
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1 }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="scanlines" />
            <FloatingParticles />
            
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f3ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
            
            {/* Dynamic radial gradient based on hover */}
            <AnimatePresence>
                {hoveredIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"
                        style={{
                            background: `radial-gradient(circle at center, ${DIFFICULTIES[hoveredIndex].color}15 0%, transparent 70%)`
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Pulsing orbs */}
            <motion.div 
                className="absolute top-20 left-20 w-96 h-96 bg-green-500/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-2xl">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <ShieldAlert className="w-8 h-8 text-cyber-cyan" />
                        </motion.div>
                        <h1 className="font-orbitron text-4xl md:text-5xl tracking-widest uppercase">
                            <span className="text-cyber-cyan">Code</span>
                            <span className="text-white">Ronin</span>
                        </h1>
                    </div>

                    {/* Subtitle with animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-gray-400 text-lg mb-2">Select Threat Level</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-cyber-cyan/60 uppercase tracking-wider">
                            <Swords className="w-3 h-3" />
                            <span>Choose your saboteur's intensity</span>
                        </div>
                    </motion.div>

                    {/* Decorative line */}
                    <motion.div
                        className="mt-6 mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    />
                </motion.div>

                {/* Difficulty Cards */}
                <div className="flex flex-col gap-5 w-full">
                    {DIFFICULTIES.map((difficulty, i) => {
                        const Icon = difficulty.icon;
                        const isHovered = hoveredIndex === i;
                        const isSelected = selectedDifficulty === difficulty.id;

                        return (
                            <motion.button
                                key={difficulty.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 100 }}
                                onClick={() => handleDifficulty(difficulty.id)}
                                onHoverStart={() => setHoveredIndex(i)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                disabled={selectedDifficulty !== null}
                                className="relative group"
                            >
                                {/* Glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg opacity-0 blur-xl transition-opacity"
                                    style={{ 
                                        backgroundColor: difficulty.color,
                                        opacity: isHovered ? 0.3 : 0
                                    }}
                                />

                                {/* Card content */}
                                <div className="relative p-6 rounded-lg border-2 bg-black/70 backdrop-blur-xl transition-all duration-300 overflow-hidden"
                                    style={{
                                        borderColor: isHovered ? difficulty.color : '#00f3ff30'
                                    }}
                                >
                                    {/* Background gradient on hover */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${difficulty.gradient} opacity-0 transition-opacity`}
                                        style={{ opacity: isHovered ? 0.05 : 0 }}
                                    />

                                    {/* Selection overlay */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                                style={{ backgroundColor: difficulty.color + '20' }}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                    className="text-6xl font-bold"
                                                    style={{ color: difficulty.color }}
                                                >
                                                    ✓
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative flex items-start gap-4">
                                        {/* Icon and Threat Level */}
                                        <div className="flex flex-col items-center gap-3">
                                            <motion.div
                                                className="relative"
                                                animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 blur-lg opacity-50"
                                                    style={{ backgroundColor: difficulty.color }}
                                                    animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
                                                />
                                                <div 
                                                    className="relative p-3 rounded-lg border-2 bg-black/50"
                                                    style={{ borderColor: difficulty.color }}
                                                >
                                                    <Icon className="w-8 h-8" style={{ color: difficulty.color }} />
                                                </div>
                                            </motion.div>

                                            {/* Threat level bars */}
                                            <ThreatIndicator level={difficulty.threatLevel} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center justify-between mb-2">
                                                <h2 
                                                    className="font-orbitron text-xl font-bold tracking-wider transition-colors"
                                                    style={{ color: isHovered ? difficulty.color : '#ffffff' }}
                                                >
                                                    {difficulty.label}
                                                </h2>

                                                {/* Level badge */}
                                                <motion.div
                                                    className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                                                    style={{ 
                                                        borderColor: difficulty.color,
                                                        color: difficulty.color,
                                                        backgroundColor: difficulty.color + '15'
                                                    }}
                                                    animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                                                >
                                                    LVL {difficulty.threatLevel}
                                                </motion.div>
                                            </div>

                                            <p className="text-gray-400 text-sm mb-3 font-mono">
                                                {difficulty.desc}
                                            </p>

                                            {/* Threat types */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {difficulty.threats.map((threat, idx) => (
                                                    <motion.span
                                                        key={idx}
                                                        className="px-2 py-1 rounded text-xs border"
                                                        style={{ 
                                                            borderColor: difficulty.color + '40',
                                                            color: difficulty.color + 'cc',
                                                            backgroundColor: difficulty.color + '08'
                                                        }}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.7 + i * 0.15 + idx * 0.05 }}
                                                    >
                                                        {threat}
                                                    </motion.span>
                                                ))}
                                            </div>

                                            {/* Hover indicator */}
                                            <motion.div
                                                className="flex items-center gap-2 text-xs uppercase tracking-wider transition-colors"
                                                style={{ color: isHovered ? difficulty.color : '#6b7280' }}
                                            >
                                                <Flame className="w-3 h-3" />
                                                <span>Enter the Arena</span>
                                                <motion.div
                                                    animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                                                    transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Animated border on hover */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left"
                                        style={{ backgroundColor: difficulty.color }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isHovered ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Warning Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 p-4 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-500 text-sm font-bold mb-1">WARNING: NEURAL SABOTEUR ACTIVE</p>
                            <p className="text-gray-400 text-xs font-mono">
                                The AI will inject bugs into your code based on the selected threat level. 
                                Debug carefully and trust nothing.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-600 text-xs font-mono flex items-center justify-center gap-2">
                        <Terminal className="w-3 h-3" />
                        <span>Higher levels = more realistic production bugs</span>
                    </p>
                </motion.div>
            </div>

            {/* Version info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="absolute bottom-6 text-xs text-gray-700 font-mono"
            >
                THREAT LEVEL SELECTION | STEP 2/2
            </motion.div>
        </div>
    );
};

export default Difficulty;