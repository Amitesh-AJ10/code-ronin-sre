import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, Mail, AlertCircle, CheckCircle2, Loader2, ShieldCheck, Zap } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [supabaseStatus, setSupabaseStatus] = useState<{ ok: boolean; message: string } | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        testSupabaseConnection().then(setSupabaseStatus);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (signInError) {
            const msg =
                signInError.message.toLowerCase().includes('email not confirmed')
                    ? 'Check your email and click the confirmation link, then try again.'
                    : signInError.message;
            setError(msg);
            return;
        }
        navigate('/skills', { replace: true });
    };

    // Floating particles background
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
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
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Decorative corner brackets */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-cyber-cyan" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-cyber-cyan" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-cyber-cyan" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-cyber-cyan" />

                {/* Main container */}
                <div className="relative rounded-lg border-2 border-cyber-cyan/30 bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)]">
                    
                    {/* Top accent line */}
                    <motion.div 
                        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    />

                    <div className="p-8">
                        {/* Header with icon */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <motion.h1 
                                    className="font-orbitron text-3xl tracking-widest uppercase mb-2 flex items-center gap-3"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="relative">
                                        <motion.div
                                            className="absolute inset-0 bg-cyber-cyan blur-lg opacity-50"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <ShieldCheck className="w-8 h-8 text-cyber-cyan relative z-10" />
                                    </div>
                                    <span className="text-cyber-cyan">Code</span>
                                    <span className="text-white">Ronin</span>
                                </motion.h1>
                                <motion.p 
                                    className="text-sm text-gray-400 ml-11"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Sign in to enter the dojo
                                </motion.p>
                            </div>
                            
                            {/* Animated terminal icon */}
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Terminal className="w-10 h-10 text-cyber-cyan/30" />
                            </motion.div>
                        </div>

                        {/* Supabase Status Banner */}
                        <AnimatePresence>
                            {supabaseStatus !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className={`mb-6 rounded-md px-4 py-3 text-xs font-mono border-2 flex items-center gap-2 ${
                                        supabaseStatus.ok 
                                            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                                            : 'bg-red-500/10 border-red-500/50 text-red-400'
                                    }`}
                                    role="status"
                                >
                                    {supabaseStatus.ok ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 animate-pulse" />
                                    )}
                                    <div>
                                        <div className="font-bold mb-1">DATABASE STATUS</div>
                                        <div className="opacity-80">{supabaseStatus.message}</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Email Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label 
                                    htmlFor="email" 
                                    className="block text-xs text-cyber-cyan/80 uppercase tracking-wider mb-2 flex items-center gap-2"
                                >
                                    <Mail className="w-3 h-3" />
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-blue-500 rounded opacity-0 group-hover:opacity-20 blur transition-opacity"
                                        animate={focusedField === 'email' ? { opacity: 0.3 } : {}}
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        autoComplete="email"
                                        className="relative w-full px-4 py-3 rounded-md bg-gray-900/80 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all duration-300 font-mono"
                                        placeholder="operative@coderonin.io"
                                    />
                                    <motion.div
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={email.includes('@') ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label 
                                    htmlFor="password" 
                                    className="block text-xs text-cyber-cyan/80 uppercase tracking-wider mb-2 flex items-center gap-2"
                                >
                                    <Lock className="w-3 h-3" />
                                    Password
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-blue-500 rounded opacity-0 group-hover:opacity-20 blur transition-opacity"
                                        animate={focusedField === 'password' ? { opacity: 0.3 } : {}}
                                    />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        autoComplete="current-password"
                                        className="relative w-full px-4 py-3 rounded-md bg-gray-900/80 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all duration-300 font-mono"
                                        placeholder="••••••••••••"
                                    />
                                    <motion.div
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={password.length >= 6 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                                    >
                                        <Lock className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="rounded-md bg-red-500/10 border-2 border-red-500/50 p-3 flex items-start gap-2"
                                        role="alert"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-red-400 mb-1">AUTHENTICATION ERROR</div>
                                            <p className="text-sm text-red-300">{error}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="relative mt-2 w-full py-3 rounded-md font-bold text-white bg-cyber-cyan hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
                            >
                                {/* Button glow effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            AUTHENTICATING...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            INITIATE LOGIN SEQUENCE
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-3 text-gray-500 tracking-wider">New Operative?</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center"
                        >
                            <Link 
                                to="/register" 
                                className="group inline-flex items-center gap-2 text-sm text-cyber-cyan hover:text-white transition-colors relative"
                            >
                                <span className="relative">
                                    CREATE NEW ACCOUNT
                                    <motion.span
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-cyan origin-left"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </span>
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Security Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-600"
                        >
                            <ShieldCheck className="w-3 h-3" />
                            <span>SECURED BY SUPABASE AUTH</span>
                        </motion.div>
                    </div>

                    {/* Bottom accent line */}
                    <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    />
                </div>
            </motion.div>

            {/* Version info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 text-xs text-gray-700 font-mono"
            >
                CODERONIN v1.0.0 | AGENTATHON 2026
            </motion.div>
        </div>
    );
};

export default Login;