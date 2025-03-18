import { formatDateTime, formatTime, timeDifference } from "@/lib/formatter";
import { Bookmark, SquareArrowOutUpRight } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import youtubeIcon from "../assets/youtube.svg";
import { Contest } from "@/types/contest";
import { updateBookmark } from "@/lib/http/bookmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FilterContext } from "@/store/filter-context";
import { UserContext } from "@/store/user-context";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import { editContestYoutubeUrl } from "@/lib/http/contests";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


interface RemainingTime {
    hours: string;
    minutes: string;
    seconds: string;
}



const ContestCard = ({ contest }: { contest: Contest }) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const [isBookmarked, setIsBookmarked] = useState(contest.isBookmarked);
    const [offset] = useState(parseInt(searchParams.get("offset") || "0"));
    const filterCtx = useContext(FilterContext);
    const userCtx = useContext(UserContext);
    const [youtubeUrl, setYoutubeUrl] = useState(contest.youtubeUrl || "");
    const [modalOpen, setModalOpen] = useState(false);

    const formattedStartTime = formatDateTime(contest.startsAt);
    const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: "00", minutes: "00", seconds: "00" });
    const formattedDuration = formatTime(contest.duration);


    // Update bookmark and UI (handle success and fallback)
    const { mutate } = useMutation({
        mutationFn: async (contestId: number) => updateBookmark(contestId),
        onMutate: async () => {
            setIsBookmarked(prev => !prev);
        },
        onError: (_, __, ___) => {
            setIsBookmarked(prev => !prev);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarked-contests", offset, 20, filterCtx.platforms, filterCtx.type] })
        }
    });


    const { mutate: mutateOnContestEdit } = useMutation({
        mutationFn: async ({ contestId, youtubeUrl }: { contestId: number, youtubeUrl: string }) => await editContestYoutubeUrl(contestId, youtubeUrl),
        onSettled: async () => {
            queryClient.invalidateQueries({ queryKey: ["bookmarked-contests", offset, 20, filterCtx.platforms, filterCtx.type] })
        }
    })


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
        mutate(contestId);
    }

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setYoutubeUrl(ev.target.value);
    }

    const handleModal = async () => {
        if (modalOpen) {
            await mutateOnContestEdit({ youtubeUrl, contestId: contest.id });
        }
        setModalOpen(!modalOpen);
    };

    return (
        <div
            className="w-full rounded-lg p-6 dark:bg-gray-500/10 bg-white relative"
            style={{
                boxShadow: "0 0 20px 4px rgba(0, 0, 0, 0.05)"
            }}
        >
            {contest.isRunning && <div className="absolute -right-1 -top-2">
                <p className="py-1 px-1.5 bg-blue-400/60 rounded-xl text-xs">RUNNING</p>
            </div>}
            {userCtx.isAuthenticated && userCtx.user === "ADMIN" && contest.hasEnded && <div>
                <div className="w-full flex items-end justify-end mb-1">
                    <Button
                        size={'sm'}
                        className="h-5 px-2 uppercase"
                        variant={'outline'}
                        onClick={handleModal}
                    >
                        edit
                    </Button>
                    <Modal
                        isOpen={modalOpen}
                        handleModal={handleModal}
                        children={<>
                            <div>
                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="grid grid-cols-2 justify-center items-center gap-y-2">
                                        <Label htmlFor="contestTitle">Contest</Label>
                                        <Input
                                            id="contestTitle"
                                            placeholder={contest.title}
                                            disabled
                                        />
                                        <Label htmlFor="youtubeUrl">Youtube URL</Label>
                                        <Input
                                            id="youtubeUrl"
                                            placeholder={youtubeUrl}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <Button onClick={handleModal}>Save</Button>
                                </div>
                            </div>

                        </>}
                    />

                </div>
            </div>}
            <div className="flex items-center mb-2 justify-between">
                <div className="flex items-center space-x-2">
                    <p className="py-1 px-1.5 bg-blue-200/40 rounded-sm text-xs uppercase">{contest.platform}</p>

                    {hasEnded ? <p className="text-xs py-1 px-1.5 rounded-xl bg-red-500/70 text-white  ">ENDED</p> : <p className={`text-sm  ${contest.isRunning ? 'text-red-500' : 'text-amber-600'}`}>{formattedRemTime}</p>}
                </div>
                <div className="flex space-x-1 text-gray-400 justify-center items-center transition-all duration-300 ease-in-out">
                    <div about="test" className={`w-[25px] h-[25px] flex justify-center items-center ${youtubeUrl ? "visible" : "hidden"}`}><a target="_blank" href={youtubeUrl}><img src={youtubeIcon} className="w-[20px] hover:w-[25px] hover:h-[25px] transition-all duration-300 ease-in-out" /></a></div>

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