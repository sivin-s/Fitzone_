import { Navigate } from 'react-router';
import ResetPasswordFormAndOtpForm  from '../components/auth/ResetPasswordFormAndOtpForm';
import ForgotPasswordResetSuccess from '../components/auth/ForgotPasswordResetSuccess';
import PasswordResetLayout from '../layouts/PasswordResetLayout';
import { usePasswordReset } from '../hooks/usePasswordReset';

export default function ForgotOTPPasswordPage() {
    const flow = usePasswordReset();
    if (!flow.isSubmitted) return <Navigate to="/forgot-password" replace />;

    return (
        <PasswordResetLayout>
            {flow.isResetSuccess ? <ForgotPasswordResetSuccess /> : <ResetPasswordFormAndOtpForm {...flow} />}
        </PasswordResetLayout>
    );
}
