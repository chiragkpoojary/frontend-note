import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";
export default function Visits() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vists`);
                setCount(res.data.visitCount);
            } catch (error) {
                console.error("Error fetching visits:", error);
            }
        };
console.log(count)
        fetchVisits();
    }, []);

    return (

            <div className="sm:absolute top-3 left-3 z-50">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white shadow text-sm text-gray-800">
                    <Users className="w-8 h-8 text-gray-800" />
                    {count !== null ? (
                        <span>
          Visits: <span className="font-bold">{count}</span>
        </span>
                    ) : (
                        <span className="text-gray-400">Loading...</span>
                    )}
                </div>
            </div>

    );
}
