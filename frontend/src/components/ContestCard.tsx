import { formatDateTime, formatTime, timeDifference } from "@/lib/formatter";
import { Bookmark, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";

interface RemainingTime {
    hours: string;
    minutes: string;
    seconds: string;
}



const ContestCard = ({ id, platform, startsAt, duration, contestTitle }: { id: number, platform: string, startsAt: Date, duration: number, contestTitle: string }) => {
    const formattedStartTime = formatDateTime(startsAt);
    const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: "00", minutes: "00", seconds: "00" });
    const formattedDuration = formatTime(duration);
    useEffect(() => {
        setRemainingTime(timeDifference(startsAt));
        const timer = setInterval(() => {
            setRemainingTime(timeDifference(startsAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    return (
        <div
            className="w-full  rounded-lg p-6"
            style={{
                boxShadow: "0 0 20px 4px rgba(0, 0, 0, 0.05)"
            }}
        >
            <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center space-x-1">
                    <p className="py-1 px-1.5 bg-blue-200/40 rounded-2xl text-xs">{platform}</p>
                    <p className="text-sm text-amber-600">{`${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`}</p>
                </div>
                <div className="flex space-x-2 text-gray-400">
                    <Bookmark size={18} />
                    <SquareArrowOutUpRight size={18} />
                </div>
            </div>
            <h4 className="text-xl font-medium">{contestTitle}</h4>
            <p className="text-gray-600 text-sm">{formattedStartTime}</p>
            <p className="text-gray-600 text-sm">Duration: {formattedDuration} hours</p>
        </div>
    )
}

export default ContestCard