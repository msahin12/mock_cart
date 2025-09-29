import { useState } from "react";
import { CreditCard, Wallet, Plus, Minus, Trash2 } from "lucide-react";

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

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Wireless Headphones", price: 120, quantity: 1 },
        { id: 2, name: "Smart Watch", price: 200, quantity: 1 },
    ]);


    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePayment = (method) => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (method === "TMU") {
            if (window.TMUPayment) {
                window.TMUPayment.open({
                    amount: total,
                    returnUrl: "/success",
                    onSuccess: (result) => {
                        console.log('Payment result:', result);
                    },
                    onCancel: () => {
                        console.log('Payment cancelled');
                    },
                    onError: (error) => {
                        console.log(`Payment failed: ${error}`);
                    }
                });
            } else {
                alert('TMU Payment system not available');
            }
            return;
        }

        alert(`Processing ${method} payment for $${total.toFixed(2)}`);
        console.log(`Payment method: ${method}, Total: $${total.toFixed(2)}`);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
                <Card className="rounded-2xl shadow-md">
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <Button
                            onClick={() => setCartItems([
                                { id: 1, name: "Wireless Headphones", price: 120, quantity: 1 },
                                { id: 2, name: "Smart Watch", price: 200, quantity: 1 },
                            ])}
                            className="rounded-2xl"
                        >
                            Add Sample Items
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid gap-4 w-full max-w-lg">
                {cartItems.map((product) => (
                    <Card key={product.id} className="rounded-2xl shadow-md">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-lg font-bold text-blue-600">${product.price}</p>
                                </div>
                                <Button
                                    onClick={() => removeItem(product.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full w-8 h-8 p-0"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold">{product.quantity}</span>
                                    <Button
                                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full w-8 h-8 p-0"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                                <p className="text-lg font-bold">${(product.price * product.quantity).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md">
                    <p className="text-xl font-semibold">Total</p>
                    <p className="text-xl font-bold">${total.toFixed(2)}</p>
                </div>

                <div className="grid gap-3 mt-4">
                    <Button
                        onClick={() => handlePayment("TMU")}
                        className="flex items-center gap-2 rounded-2xl"
                        variant="default"
                    >
                        <Wallet className="w-5 h-5" /> Pay with TMU
                    </Button>
                    <Button
                        onClick={() => handlePayment("Card")}
                        className="flex items-center gap-2 rounded-2xl"
                        variant="outline"
                    >
                        <CreditCard className="w-5 h-5" /> Pay with Card
                    </Button>
                </div>
            </div>
        </div>
    );
} 