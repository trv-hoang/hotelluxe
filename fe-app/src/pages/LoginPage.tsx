import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/api/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/profile");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen px-6">
            <h1 className="text-2xl font-bold mb-6">Login to your Account</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" className="w-full bg-green-700 text-white">
                    Sign in
                </Button>

                <p className="text-sm text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-green-600">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
