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

        let timeLeft;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000//
            // in seconds

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            timeLeft = decoded.exp - currentTime;


            if (timeLeft <= 0) {
                handleLogout(); // already expired
            } else {
                const timer = setTimeout(() => {
                    handleLogout(); // auto logout when token expires
                }, timeLeft * 1000); // convert to milliseconds

                return () => clearTimeout(timer); // clean up on unmount
            }
        } catch (err :any) {
            console.error("Invalid token:", err.message);
            handleLogout();
        }
    }, []);
};
