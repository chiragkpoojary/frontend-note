import { useEffect } from "react";
// @ts-ignore
import { jwtDecode } from "jwt-decode";

export const useAutoLogout = () => {
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (!token) return;

        const handleLogout = () => {
            localStorage.removeItem("jwtToken");
            alert("Session expired. Please log in again.");
            window.location.href = "/"; // or use navigate('/')
        };

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // in seconds
            const timeLeft = decoded.exp - currentTime;

            if (timeLeft <= 0) {
                handleLogout(); // already expired
            } else {
                const timer = setTimeout(() => {
                    handleLogout(); // auto logout when token expires
                }, timeLeft * 1000); // convert to milliseconds

                return () => clearTimeout(timer); // clean up on unmount
            }
        } catch (err) {
            console.error("Invalid token:", err.message);
            handleLogout();
        }
    }, []);
};
