import { Link } from 'react-router';
import { BadgeCheck } from 'lucide-react';


export default function ForgotPasswordResetSuccess() {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">

            <BadgeCheck />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">Password Reset Success!</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Your password has been changed successfully. You can now use your new password to log in.
        </p>

        <Link
            to="/login"
            className="mt-6 inline-block w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl text-sm text-center"
        >
            Proceed to Login
        </Link>
    </div>
    );
}
