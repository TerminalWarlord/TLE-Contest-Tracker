import { ArrowDown01, ArrowDownWideNarrow, ArrowUp01, FilterIcon, X } from "lucide-react"
import { Button } from "./ui/button"
import { useContext, useEffect, useState } from "react"
import { FilterContext } from "@/store/filter-context";
import { PlatformType } from "@/types/contest";



const Filter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterCtx = useContext(FilterContext);

    const [platforms, setPlatforms] = useState<PlatformType[]>(filterCtx.platforms);

    useEffect(() => {
        setPlatforms(filterCtx.platforms);
    }, [filterCtx]);
    
    // console.log(filterCtx.type)

    function toggleFilter() {
        setIsFilterOpen(prevState => !prevState)
    }

    return (
        <div
            className="w-7/8 bg-white dark:bg-gray-800/30 rounded-lg py-3 flex justify-between items-center px-4  flex-col"
            style={{
                boxShadow: "0 5px 20px 2px rgba(0, 0, 0, 0.05)"
            }}>
            <div className="flex justify-between items-center w-full">
                <div className="flex space-x-1 items-center px-1 md:px-4 cursor-pointer" onClick={toggleFilter}>
                    <FilterIcon size={15} />
                    <p className="text-xs md:text-sm lg:text-base">Filter</p>
                </div>
                <div className="flex space-y-2 md:space-y-0 transition-all ease-in-out duration-400 flex-col md:flex-row md:space-x-2 justify-center">
                    <Button
                        className="rounded-xl cursor-pointer transition-all ease-in-out duration-400 text-xs md:text-md lg:text-base"
                        variant={`${filterCtx.type === "all" ? "default" : "outline"}`}
                        onClick={() => filterCtx.updateFilterType('all')}
                    >
                        <ArrowDownWideNarrow /> All
                    </Button>
                    <Button
                        className="rounded-xl cursor-pointer transition-all ease-in-out duration-400 text-xs md:text-md lg:text-base"
                        variant={`${filterCtx.type === "upcoming" ? "default" : "outline"}`}
                        onClick={() => filterCtx.updateFilterType('upcoming')}
                    >
                        <ArrowDown01 /> Upcoming
                    </Button>
                    <Button
                        className="rounded-xl cursor-pointer transition-all ease-in-out duration-400 text-xs md:text-md lg:text-base"
                        variant={`${filterCtx.type === "past" ? "default" : "outline"}`}
                        onClick={() => filterCtx.updateFilterType('past')}

                    >
                        <ArrowUp01 /> Past
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-hidden transition-all duration-900 ease-in-out ${isFilterOpen ? "opacity-100 max-h-40 my-1" : "opacity-0 max-h-0 my-0"}`}>
                <div className="bg-slate-500/10 h-0.5 rounded-2xl w-full"></div>
                <div className="flex justify-between items-center">
                    <div className="my-2 flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:flex-row ">
                        <Button
                            onClick={() => filterCtx.updatePlatform("CODEFORCES")}
                            className={`text-xs md:text-md lg:text-base rounded-2xl cursor-pointer ${platforms.includes("CODEFORCES") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Codeforces
                        </Button>
                        <Button
                            onClick={() => filterCtx.updatePlatform("CODECHEF")}
                            className={`text-xs md:text-md lg:text-base rounded-2xl cursor-pointer ${platforms.includes("CODECHEF") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Codechef
                        </Button>
                        <Button
                            onClick={() => filterCtx.updatePlatform("LEETCODE")}
                            className={`text-xs md:text-md lg:text-base rounded-2xl cursor-pointer ${platforms.includes("LEETCODE") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Leetcode
                        </Button>

                    </div>
                    <div>
                        <div
                            className="flex items-center justify-center space-x-1 cursor-pointer"
                            onClick={() => filterCtx.resetPlatform()}
                        >
                            <X size={15} /> <p className="text-xs md:text-md lg:text-base">Reset</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Filter