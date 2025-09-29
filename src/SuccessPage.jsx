import { CheckCircle, ArrowLeft, Home, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Simple Card component
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-md ${className}`}>
        {children}
    </div>
);

// Simple CardContent component
const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

// Simple Button component
const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
        ghost: "hover:bg-gray-100"
    };

    const sizeClasses = {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-sm"
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button className={classes} onClick={onClick}>
            {children}
        </button>
    );
};

export default function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const redirectStatus = searchParams.get('redirect_status');
    const isPaymentFailed = redirectStatus === 'failed';
    const paymentIntent = searchParams.get('payment_intent');

    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        navigate('/');
    };

    if (isPaymentFailed) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="mb-6">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                            <p className="text-gray-600">
                                Unfortunately, your payment could not be processed. Please try again or use a different payment method.
                            </p>
                            {paymentIntent && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Payment ID: {paymentIntent}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleGoHome}
                                className="w-full rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Try Again
                            </Button>

                            <Button
                                onClick={handleGoBack}
                                variant="outline"
                                className="w-full rounded-2xl flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                If you continue to experience issues, please contact support.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase. Your payment has been processed successfully.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleGoHome}
                            className="w-full rounded-2xl flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Continue Shopping
                        </Button>

                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="w-full rounded-2xl flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            You will receive a confirmation email shortly with your order details.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
