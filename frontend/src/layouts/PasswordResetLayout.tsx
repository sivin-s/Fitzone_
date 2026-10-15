import type { ReactNode } from 'react';
import { Link } from 'react-router';

export default function PasswordResetLayout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#F8F9FB] min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-screen-xl mx-auto">
                    <div className="px-6 py-5 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-x-2">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-dumbbell text-white text-xl"></i>
                                </div>
                                <span className="logo-font text-2xl font-semibold tracking-tighter text-black">FitZone</span>
                            </Link>
                        </div>

                        {/* Nav Actions */}
                        <div className="flex items-center gap-x-3">
                            <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {children}  {/* form children */}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-5 mt-auto">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 text-sm">
                        {/* Footer Left */}
                        <div>
                            <span className="logo-font font-semibold text-lg text-black">FitZone</span>
                            <p className="text-xs text-gray-400 mt-1">© 2024 FitZone. All rights reserved.</p>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                            <Link to="/about" className="text-gray-500 hover:text-gray-700 transition-colors">About Us</Link>
                            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</Link>
                            <Link to="/support" className="text-gray-500 hover:text-gray-700 transition-colors">Contact Support</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
