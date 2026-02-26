import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, Mail, AlertCircle, CheckCircle2, Loader2, UserPlus, Zap, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: 'None', color: 'gray' };
        
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
        const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
        
        return { 
            score, 
            label: labels[Math.min(score - 1, 4)] || 'Weak', 
            color: colors[Math.min(score - 1, 4)] || 'red',
            percentage: (score / 5) * 100
        };
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        setSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
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

    // Success State
    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
                <div className="scanlines" />
                <FloatingParticles />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Success glow */}
                    <motion.div
                        className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative rounded-lg border-2 border-green-500/50 bg-black/80 backdrop-blur-xl p-8 text-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        {/* Success icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <motion.div
                                    className="absolute inset-0 bg-green-500 blur-xl opacity-50"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <div className="relative z-10 p-4 rounded-full border-4 border-green-500 bg-black">
                                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Success message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-green-500 font-orbitron text-2xl mb-4 tracking-wider">
                                ACCOUNT CREATED
                            </h2>
                            <div className="space-y-3 text-gray-300">
                                <p className="flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4 text-green-500" />
                                    Check your email for confirmation link
                                </p>
                                <p className="text-sm text-gray-500">
                                    Email sent to: <span className="text-green-500 font-mono">{email}</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Loading bar */}
                        <motion.div
                            className="mt-8 space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Redirecting to login...</span>
                                <motion.span
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Loader2 className="w-3 h-3 inline animate-spin" />
                                </motion.span>
                            </div>
                            <div className="relative w-full bg-black/50 border border-green-500/30 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Registration Form
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
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 blur-3xl rounded-full"
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
                                        <UserPlus className="w-8 h-8 text-cyber-cyan relative z-10" />
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
                                    Create your operative account
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

                        {/* Registration Form */}
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
                                        animate={email.includes('@') && email.includes('.') ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
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
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        autoComplete="new-password"
                                        minLength={6}
                                        className="relative w-full px-4 py-3 pr-10 rounded-md bg-gray-900/80 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all duration-300 font-mono"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-cyan transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2 space-y-1"
                                    >
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="h-1 flex-1 rounded-full bg-gray-800"
                                                    initial={{ scaleX: 0 }}
                                                    animate={{
                                                        scaleX: i < passwordStrength.score ? 1 : 0,
                                                        backgroundColor: i < passwordStrength.score 
                                                            ? passwordStrength.color === 'red' ? '#ef4444'
                                                            : passwordStrength.color === 'orange' ? '#f97316'
                                                            : passwordStrength.color === 'yellow' ? '#eab308'
                                                            : passwordStrength.color === 'lime' ? '#84cc16'
                                                            : '#22c55e'
                                                            : '#1f2937'
                                                    }}
                                                    transition={{ delay: i * 0.1 }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className={`font-mono ${
                                                passwordStrength.color === 'red' ? 'text-red-400'
                                                : passwordStrength.color === 'orange' ? 'text-orange-400'
                                                : passwordStrength.color === 'yellow' ? 'text-yellow-400'
                                                : passwordStrength.color === 'lime' ? 'text-lime-400'
                                                : 'text-green-400'
                                            }`}>
                                                {passwordStrength.label}
                                            </span>
                                            <span className="text-gray-600">{password.length} chars</span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Confirm Password Field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label 
                                    htmlFor="confirmPassword" 
                                    className="block text-xs text-cyber-cyan/80 uppercase tracking-wider mb-2 flex items-center gap-2"
                                >
                                    <Lock className="w-3 h-3" />
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-blue-500 rounded opacity-0 group-hover:opacity-20 blur transition-opacity"
                                        animate={focusedField === 'confirmPassword' ? { opacity: 0.3 } : {}}
                                    />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        autoComplete="new-password"
                                        className="relative w-full px-4 py-3 pr-10 rounded-md bg-gray-900/80 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all duration-300 font-mono"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyber-cyan transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <motion.div
                                        className="absolute right-10 top-1/2 -translate-y-1/2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={
                                            confirmPassword && password === confirmPassword 
                                                ? { opacity: 1, scale: 1 } 
                                                : { opacity: 0, scale: 0 }
                                        }
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
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
                                            <div className="text-xs font-bold text-red-400 mb-1">REGISTRATION ERROR</div>
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
                                transition={{ delay: 0.7 }}
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
                                            CREATING ACCOUNT...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            CREATE OPERATIVE ACCOUNT
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
                                <span className="bg-black px-3 text-gray-500 tracking-wider">Already Registered?</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center"
                        >
                            <Link 
                                to="/login" 
                                className="group inline-flex items-center gap-2 text-sm text-cyber-cyan hover:text-white transition-colors relative"
                            >
                                <span className="relative">
                                    RETURN TO LOGIN
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
                            transition={{ delay: 0.9 }}
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

export default Register;