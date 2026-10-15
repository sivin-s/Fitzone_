//   Email submit for otp and reset the password


import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import type { usePasswordReset } from '../../hooks/usePasswordReset';
type Props = Pick<ReturnType<typeof usePasswordReset>, 'handleSubmitForgot' | 'onForgotSubmit' | 'forgotPasswordMutation' | 'forgotErrors' | 'registerForgot' | 'formError'>;

export default function ForgotPasswordForm({ handleSubmitForgot, onForgotSubmit, forgotPasswordMutation, forgotErrors, registerForgot, formError }: Props) {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-lock text-3xl text-gray-700">
                    <Mail />
                </i>
            </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-2">
            <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">Forgot Password</h1>
        </div>

        {/* Description */}
        <div className="text-center mb-7">
            <p className="text-gray-500 text-[15px] leading-relaxed">
                Enter the email associated with your account and we'll send an OTP to reset your password.
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-envelope text-gray-400"></i>
                    </div>
                    <input
                        type="email"
                        id="email"
                        required
                        disabled={forgotPasswordMutation.isPending}
                        className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${forgotErrors.email ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                        placeholder="trainer@fitzone.com"
                        {...registerForgot('email')}
                    />
                </div>
                {forgotErrors.email && (
                    <span className="block text-red-500 text-sm mt-1">{forgotErrors.email.message}</span>
                )}
                {formError && (
                    <span className="block text-red-500 text-sm mt-1">{formError}</span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-x-2 text-sm active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {forgotPasswordMutation.isPending ? (
                    <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Sending OTP...</span>
                    </>
                ) : (
                    <>
                        <span>Send OTP</span>
                        <i className="fa-solid fa-arrow-right ml-1"></i>
                    </>
                )}
            </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100"></div>

        {/* Back to Login */}
        <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                <i className="fa-solid fa-arrow-left mr-2 text-xs"></i>
                <span>Back to Login</span>
            </Link>
        </div>
    </div>
    );
}










