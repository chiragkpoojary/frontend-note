"use client";

import {
    Card,
    CardBody,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactLoading from "react-loading";


export default function ResetPassword() {
    const navigate=useNavigate();
    const searchParams = useSearchParams()[0];

    const user_id = searchParams.get("id");
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
     console.log("token", token);

        setLoading(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/resetpassword/${user_id}/${token}`,
                {password:password},
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.status === "ok") {
                alert("Password reset successful! Redirecting to login...");
                navigate("/login");
            } else {
                alert(res.data.message || "Password reset failed.");
            }
        } catch (err: any) {
            alert("An error occurred or session Expired");
            console.log(err);

        } finally {
            setLoading(false);
        }
    };

    if (!user_id || !token) {
        return (
            <section className="grid text-center h-screen items-center p-8">
                <Typography variant="h5" color="red">
                    Invalid or expired reset link.
                </Typography>
            </section>
        );
    }

    return (
        <section className="h-screen grid place-items-center bg-gray-100 px-4">
            <Card className="w-full max-w-md p-4 shadow-lg">
                <CardBody>
                    <Typography variant="h4" color="blue-gray" className="text-center mb-6">
                        Reset Password
                    </Typography>
                    <form className="space-y-6" onSubmit={handleReset}>
                        <div>
                            <Input
                                type={passwordShown ? "text" : "password"}
                                label="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type={passwordShown ? "text" : "password"}
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            variant="text"
                            color="blue-gray"
                            onClick={togglePasswordVisibility}
                            type="button"
                            className="text-sm -mt-4"
                        >
                            {passwordShown ? "Hide Passwords" : "Show Passwords"}
                        </Button>

                        <Button type="submit" color="blue" fullWidth disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </section>
    );
}
