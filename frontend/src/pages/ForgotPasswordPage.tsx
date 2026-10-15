import { Navigate } from 'react-router';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import PasswordResetLayout from '../layouts/PasswordResetLayout';
import { usePasswordReset } from '../hooks/usePasswordReset';

export default function ForgotPasswordPage() {
    const flow = usePasswordReset();
    if (flow.isSubmitted) return <Navigate to="/forgot-password/otp" replace />;

    return (
        <PasswordResetLayout>
            <ForgotPasswordForm {...flow} />
        </PasswordResetLayout>
    );
}
