import { formatDateTime, formatTime, timeDifference } from "@/lib/formatter";
import { Bookmark, SquareArrowOutUpRight, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import youtubeIcon from "../assets/youtube.svg";
import { Contest } from "@/types/contest";

interface RemainingTime {
    hours: string;
    minutes: string;
    seconds: string;
}



const ContestCard = ({ contest }: { contest: Contest }) => {
    const formattedStartTime = formatDateTime(contest.startsAt);
    const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: "00", minutes: "00", seconds: "00" });
    const formattedDuration = formatTime(contest.duration);
    useEffect(() => {
        const diff = contest.startsAt.getTime() - (new Date()).getTime();
        if (diff < 0) {
            return;
        }
        setRemainingTime(timeDifference(contest.startsAt));
        const timer = setInterval(() => {
            setRemainingTime(timeDifference(contest.startsAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    
    const formattedRemTime = `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`;

    return (
        <div
            className="w-full rounded-lg p-6 dark:bg-gray-500/10 bg-white"
            style={{
                boxShadow: "0 0 20px 4px rgba(0, 0, 0, 0.05)"
            }}
        >
            <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center space-x-1">
                    <p className="py-1 px-1.5 bg-blue-200/40 rounded-2xl text-xs">{contest.platform}</p>
                    
                    {formattedRemTime==="00:00:00"?<p className="text-xs py-1 px-1.5 rounded-2xl bg-red-300/70">ENDED</p>:<p className="text-sm text-amber-600">{formattedRemTime}</p>}
                </div>
                <div className="flex space-x-2 text-gray-400 justify-center items-center">
                    <img  src={youtubeIcon} className="w-[20px]"/>
                    <Bookmark size={18} />
                    <SquareArrowOutUpRight size={18} />
                </div>
            </div>
            <h4 className="text-xl font-medium">{contest.contestTitle}</h4>
            <p className="text-gray-600 text-sm">{formattedStartTime}</p>
            <p className="text-gray-600 text-sm">Duration: {formattedDuration} hours</p>
        </div>
    )
}

export default ContestCard