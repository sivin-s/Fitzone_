import { authService } from '../services/authService';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getApiErrorMessage } from '../lib/axios';
import { useOtpLocalStorage } from '../lib/otpLocalStorage';

import { forgotSchema, resetSchema, type ForgotFormData, type ResetFormData } from '../zodSchema/passwordReset.zodSchema'; // used in react form resolver

export function usePasswordReset() {
    const [email, setEmail] = useState(() => localStorage.getItem('forgot_password_email') || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitted, setIsSubmitted] = useState(() => !!localStorage.getItem('forgot_password_email'));
    const [isResetSuccess, setIsResetSuccess] = useState(false);
    const [formError, setFormError] = useState('');
    
    // otp localstorage hook
    const [timer, startTimer, stopTimer] = useOtpLocalStorage('forgot_password_cooldown');
   
    const canResend = timer === 0;
  
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const {
        register: registerForgot,
        handleSubmit: handleSubmitForgot,
        formState: { errors: forgotErrors },
        reset: resetForgotForm
    } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema)
    });

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: resetErrors },
        reset: resetResetForm,
        setValue: setResetValue,
        trigger: triggerResetField
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            otp: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Sync the OTP array state with react-hook-form value
    useEffect(() => {
        const joinedOtp = otp.join('');
        setResetValue('otp', joinedOtp);
        // Only trigger validation once the user has filled in all 6 digits to keep UX clean
        if (joinedOtp.length === 6) {
            triggerResetField('otp');
        }
    }, [otp, setResetValue, triggerResetField]);

    // Mutation to send the OTP
    const forgotPasswordMutation = useMutation({
        mutationFn: async (emailData: string) => {
            const response = await authService.forgotPassword({ email: emailData });
            return response.data;
        },
        onSuccess: (res, emailData) => {
            setFormError('');
            setEmail(emailData);
            setIsSubmitted(true);
            localStorage.setItem('forgot_password_email', emailData);
            
            const dynamicSeconds = res?.data?.expiresInSeconds || 55;
            startTimer(dynamicSeconds);

            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 50);
        },
        onError: (err: unknown) => {
            setFormError(getApiErrorMessage(err, 'Failed to send OTP. Please try again.'));
        }
    });

    // Mutation to reset password with the OTP
    const resetPasswordMutation = useMutation({
        mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
            const response = await authService.resetPassword(data);
            return response.data;
        },
        onSuccess: () => {
            setFormError('');
            setIsResetSuccess(true);
            localStorage.removeItem('forgot_password_email');
            stopTimer();
        },
        onError: (err: unknown) => {
            setFormError(getApiErrorMessage(err, 'Failed to reset password. Please check your OTP.'));
        }
    });

    const onForgotSubmit = (data: ForgotFormData) => {
        setFormError('');
        forgotPasswordMutation.mutate(data.email.trim());
    };

    const onResetSubmit = (data: ResetFormData) => {
        setFormError('');
        resetPasswordMutation.mutate({
            email: email.trim(),
            otp: data.otp,
            newPassword: data.newPassword.trim()
        });
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (email && canResend) {
            setFormError('');
            setOtp(['', '', '', '', '', '']);
            forgotPasswordMutation.mutate(email.trim());
        }
    };

    const handleGoBack = () => {
        setIsSubmitted(false);
        setFormError('');
        setOtp(['', '', '', '', '', '']);
        localStorage.removeItem('forgot_password_email');
        stopTimer();
        resetForgotForm();
        resetResetForm();
    };

    return { handleSubmitForgot, onForgotSubmit, forgotPasswordMutation, forgotErrors, registerForgot, formError, handleSubmitReset, onResetSubmit, registerReset, otp, inputRefs, handleOtpChange, handleOtpKeyDown, resetPasswordMutation, resetErrors, email, handleResend, canResend, timer, handleGoBack, isSubmitted, isResetSuccess };
}
