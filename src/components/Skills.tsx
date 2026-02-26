import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Zap, Lock, Terminal, ChevronRight, Sparkles } from 'lucide-react';
import { useBackButton } from '../lib/useBackButton';

const SKILLS = [
    { 
        name: 'Pandas', 
        icon: Database, 
        color: '#00f3ff',
        gradient: 'from-cyan-500 to-blue-500',
        description: 'Data manipulation & analysis',
    },
    { 
        name: 'OOPS', 
        icon: Cpu, 
        color: '#ff003c',
        gradient: 'from-red-500 to-pink-500',
        description: 'Object-oriented programming',
        
    },
    { 
        name: 'CP', 
        icon: Zap, 
        color: '#ffd700',
        gradient: 'from-yellow-500 to-orange-500',
        description: 'Competitive programming',
    },
    { 
        name: 'Cryptography', 
        icon: Lock, 
        color: '#9d4edd',
        gradient: 'from-purple-500 to-violet-500',
        description: 'Encryption & security',
    }
] as const;

const Skills: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    useBackButton();

    const handleSkill = (skill: string) => {
        setSelectedSkill(skill);
        setTimeout(() => {
            navigate('/difficulty', { replace: true, state: { skill } });
        }, 600);
    };

    // Floating particles background
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0],
                        scale: [0, 2, 0],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                    }}
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
            
            {/* Radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

            {/* Pulsing orbs */}
            <motion.div 
                className="absolute top-20 left-20 w-96 h-96 bg-cyber-cyan/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-4xl">
                
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
                            <Terminal className="w-8 h-8 text-cyber-cyan" />
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
                        <p className="text-gray-400 text-lg mb-2">Choose Your Combat Discipline</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-cyber-cyan/60 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            <span>Select one to begin training</span>
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

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {SKILLS.map((skill, i) => {
                        const Icon = skill.icon;
                        const isHovered = hoveredIndex === i;
                        const isSelected = selectedSkill === skill.name;

                        return (
                            <motion.button
                                key={skill.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 100 }}
                                onClick={() => handleSkill(skill.name)}
                                onHoverStart={() => setHoveredIndex(i)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                disabled={selectedSkill !== null}
                                className="relative group"
                            >
                                {/* Corner brackets */}
                                <motion.div 
                                    className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 transition-colors"
                                    style={{ borderColor: isHovered ? skill.color : '#00f3ff33' }}
                                />
                                <motion.div 
                                    className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 transition-colors"
                                    style={{ borderColor: isHovered ? skill.color : '#00f3ff33' }}
                                />
                                <motion.div 
                                    className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 transition-colors"
                                    style={{ borderColor: isHovered ? skill.color : '#00f3ff33' }}
                                />
                                <motion.div 
                                    className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 transition-colors"
                                    style={{ borderColor: isHovered ? skill.color : '#00f3ff33' }}
                                />

                                {/* Glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg opacity-0 blur-xl transition-opacity"
                                    style={{ 
                                        backgroundColor: skill.color,
                                        opacity: isHovered ? 0.2 : 0
                                    }}
                                />

                                {/* Card content */}
                                <div className="relative p-8 rounded-lg border-2 border-cyber-cyan/30 bg-black/60 backdrop-blur-xl transition-all duration-300 hover:border-opacity-100 hover:bg-black/80 overflow-hidden">
                                    
                                    {/* Background gradient on hover */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 transition-opacity`}
                                        style={{ opacity: isHovered ? 0.05 : 0 }}
                                    />

                                    {/* Selection overlay */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-cyber-cyan/10 backdrop-blur-sm flex items-center justify-center"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                    className="text-cyber-cyan text-6xl font-bold"
                                                >
                                                    ✓
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Icon */}
                                    <div className="flex items-start justify-start mb-4">
                                        <motion.div
                                            className="relative"
                                            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 blur-lg opacity-50"
                                                style={{ backgroundColor: skill.color }}
                                                animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
                                            />
                                            <div 
                                                className="relative p-3 rounded-lg border-2"
                                                style={{ borderColor: skill.color }}
                                            >
                                                <Icon className="w-8 h-8" style={{ color: skill.color }} />
                                            </div>
                                        </motion.div>

                                    </div>

                                    {/* Title */}
                                    <h2 
                                        className="font-orbitron text-2xl font-bold mb-2 tracking-wider transition-colors"
                                        style={{ color: isHovered ? skill.color : '#ffffff' }}
                                    >
                                        {skill.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm mb-4 font-mono">
                                        {skill.description}
                                    </p>

                                    {/* Hover indicator */}
                                    <motion.div
                                        className="flex items-center gap-2 text-xs uppercase tracking-wider transition-colors"
                                        style={{ color: isHovered ? skill.color : '#6b7280' }}
                                    >
                                        <span>Select Discipline</span>
                                        <motion.div
                                            animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                                            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Animated border on hover */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
                                        style={{ backgroundColor: skill.color }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isHovered ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 text-xs font-mono flex items-center justify-center gap-2">
                        <Terminal className="w-3 h-3" />
                        <span>Each discipline contains unique challenges and sabotage patterns</span>
                    </p>
                </motion.div>
            </div>

            {/* Version info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-6 text-xs text-gray-700 font-mono"
            >
                SKILL SELECTION | STEP 1/2
            </motion.div>
        </div>
    );
};

export default Skills;