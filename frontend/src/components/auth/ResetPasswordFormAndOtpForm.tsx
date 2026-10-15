import { MailCheck } from 'lucide-react';
import type { usePasswordReset } from '../../hooks/usePasswordReset';
type Props = Pick<ReturnType<typeof usePasswordReset>, 'handleSubmitReset' | 'onResetSubmit' | 'registerReset' | 'otp' | 'inputRefs' | 'handleOtpChange' | 'handleOtpKeyDown' | 'resetPasswordMutation' | 'resetErrors' | 'formError' | 'email' | 'handleResend' | 'canResend' | 'forgotPasswordMutation' | 'timer' | 'handleGoBack'>;

export default function ResetPasswordFormAndOtpForm({ handleSubmitReset, onResetSubmit, registerReset, otp, inputRefs, handleOtpChange, handleOtpKeyDown, resetPasswordMutation, resetErrors, formError, email, handleResend, canResend, forgotPasswordMutation, timer, handleGoBack }: Props) {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        {/* Success Icon / Mail Check */}
        <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                <MailCheck color='#10b981' size={26} />
            </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-2">
            <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">Enter OTP</h1>
        </div>

        {/* Description */}
        <div className="text-center mb-7">
            <p className="text-gray-500 text-[15px] leading-relaxed">
                We have sent a verification code to <span className="font-semibold text-gray-900">{email}</span>. Please check your inbox.
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-5" noValidate>
            {/* Hidden input to bind the OTP field to react-hook-form */}
            <input type="hidden" {...registerReset('otp')} />

            {/* OTP Code - 6 column grid inputs */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 text-center mb-3">Verification Code (OTP)</label>
                <div className="flex gap-2 sm:gap-3 justify-center mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            disabled={resetPasswordMutation.isPending}
                            className={`w-11 h-14 text-black bg-gray-50 border rounded-xl text-center text-xl font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:opacity-50 transition-all ${resetErrors.otp ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'}`}
                        />
                    ))}
                </div>
                {resetErrors.otp && (
                    <span className="block text-red-500 text-sm text-center mt-2">{resetErrors.otp.message}</span>
                )}
            </div>

            {/* New Password */}
            <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-lock text-gray-400"></i>
                    </div>
                    <input
                        type="password"
                        id="newPassword"
                        disabled={resetPasswordMutation.isPending}
                        className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${resetErrors.newPassword ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                        placeholder="••••••••"
                        {...registerReset('newPassword')}
                    />
                </div>
                {resetErrors.newPassword && (
                    <span className="block text-red-500 text-sm mt-1">{resetErrors.newPassword.message}</span>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-lock-open text-gray-400"></i>
                    </div>
                    <input
                        type="password"
                        id="confirmPassword"
                        disabled={resetPasswordMutation.isPending}
                        className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${resetErrors.confirmPassword ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                        placeholder="••••••••"
                        {...registerReset('confirmPassword')}
                    />
                </div>
                {resetErrors.confirmPassword && (
                    <span className="block text-red-500 text-sm mt-1">{resetErrors.confirmPassword.message}</span>
                )}
                {formError && (
                    <span className="block text-red-500 text-sm mt-1.5 text-center">{formError}</span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-x-2 text-sm active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {resetPasswordMutation.isPending ? (
                    <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Resetting Password...</span>
                    </>
                ) : (
                    <>
                        <span>Reset Password</span>
                        <i className="fa-solid fa-check ml-1"></i>
                    </>
                )}
            </button>
        </form>

        {/* Resend and Go Back controls */}
        <div className="mt-6 flex flex-col items-center justify-center gap-y-3 text-sm">
            <button
                type="button"
                onClick={handleResend}
                        disabled={!canResend || forgotPasswordMutation.isPending || resetPasswordMutation.isPending}
                className={`font-semibold transition-colors ${canResend ? 'text-black hover:text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
            >
                {forgotPasswordMutation.isPending ? 'Resending...' : `Resend OTP ${!canResend ? `(${timer}s)` : ''}`}
            </button>

            <hr className="w-full border-gray-100 my-1" />

            <button
                type="button"
                        onClick={handleGoBack}
                        disabled={forgotPasswordMutation.isPending || resetPasswordMutation.isPending}
                className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
                Go Back
            </button>
        </div>
    </div>
    );
}
