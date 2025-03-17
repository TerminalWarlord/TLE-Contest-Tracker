import { formatDateTime, formatTime, timeDifference } from "@/lib/formatter";
import { Bookmark, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import youtubeIcon from "../assets/youtube.svg";
import { Contest } from "@/types/contest";
import { updateBookmark } from "@/lib/http/bookmarks";

interface RemainingTime {
    hours: string;
    minutes: string;
    seconds: string;
}



const ContestCard = ({ contest }: { contest: Contest }) => {

    const [isBookmarked, setIsBookmarked] = useState(contest.isBookmarked);

    const formattedStartTime = formatDateTime(contest.startsAt);
    const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: "00", minutes: "00", seconds: "00" });
    const formattedDuration = formatTime(contest.duration);


    // The API returns UNIX time (in second), but JS need miliseconds to be passed into Date()
    const startsAtDateTimeObj = new Date(contest.startsAt * 1000);



    // Update the remaining time to start (every second)
    useEffect(() => {
        if (contest.hasEnded) {
            return;
        }
        setRemainingTime(timeDifference(startsAtDateTimeObj));
        const timer = setInterval(() => {
            setRemainingTime(timeDifference(startsAtDateTimeObj));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // FOrmat the time in `HH:MM:SS`
    const formattedRemTime = `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`;
    const hasEnded = contest.hasEnded;


    const handleBookmarkUpdate = async (contestId: number) => {
        // need to invalidate users bookmarks
        let bookmarked;
        setIsBookmarked(prevState => {
            return bookmarked = !prevState;
        });
        try {
            await updateBookmark(contestId);
        }
        catch (err) {
            setIsBookmarked(!bookmarked);
        }
    }

    return (
        <div
            className="w-full rounded-lg p-6 dark:bg-gray-500/10 bg-white"
            style={{
                boxShadow: "0 0 20px 4px rgba(0, 0, 0, 0.05)"
            }}
        >
            <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center space-x-2">
                    <p className="py-1 px-1.5 bg-blue-200/40 rounded-sm text-xs uppercase">{contest.platform}</p>

                    {hasEnded ? <p className="text-xs py-1 px-1.5 rounded-xl bg-red-500/70 text-white  ">ENDED</p> : <p className="text-sm text-amber-600">{formattedRemTime}</p>}
                </div>
                <div className="flex space-x-1 text-gray-400 justify-center items-center transition-all duration-300 ease-in-out">
                    <div about="test" className={`w-[25px] h-[25px] flex justify-center items-center ${contest.youtubeUrl ? "visible" : "hidden"}`}><a target="_blank" href={`https://youtube.com/watch?v=${contest.youtubeUrl}`}><img src={youtubeIcon} className="w-[20px] hover:w-[25px] hover:h-[25px] transition-all duration-300 ease-in-out" /></a></div>

                    <div className="w-[25px] h-[25px] flex justify-center items-center">
                        <Bookmark size={18}
                            onClick={() => handleBookmarkUpdate(contest.id)}
                            className={`hover:w-[20px] h-[20px]
                         transition-all duration-300 ease-in-out  ${isBookmarked ? 'fill-blue-400  text-blue-400 hover:text-blue-400 dark:fill-blue-300 dark:text-blue-300  hover:dark:text-blue-300' : 'fill-transparent hover:text-black hover:dark:text-white'}`}
                        />
                    </div>

                    <div className="w-[25px] h-[25px] flex justify-center items-center"><a href={contest.url} className="hover:text-black hover:dark:text-white "><SquareArrowOutUpRight size={18} className=" hover:w-[20px] h-[20px] transition-all duration-300 ease-in-out" /></a></div>
                </div>
            </div>
            <h4 className="text-md md:text-lg lg:text-xl font-medium text-black dark:text-gray-300">{contest.title}</h4>
            <p className="text-gray-600 text-xs md:text-sm">{formattedStartTime}</p>
            <p className="text-gray-600 text-xs md:text-sm">Duration: {formattedDuration} hours</p>
        </div>
    )
}

export default ContestCard