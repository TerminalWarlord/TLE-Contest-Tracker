import { ArrowDown01, ArrowUp01, FilterIcon, X } from "lucide-react"
import { Button } from "./ui/button"
import { useContext, useEffect, useState } from "react"
import { FilterContext } from "@/store/filter-context";
import { PlatformType } from "@/types/contest";



const Filter = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterCtx = useContext(FilterContext);

    const [platforms, setPlatforms] = useState<PlatformType[]>(filterCtx.platforms);
    
    useEffect(()=>{
        setPlatforms(filterCtx.platforms);
    }, [filterCtx]);
    console.log(filterCtx.type)
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
                <div className="flex space-x-1 items-center px-4 cursor-pointer" onClick={toggleFilter}>
                    <FilterIcon size={15} />
                    <p>Filter</p>
                </div>
                <div className="flex space-x-2 transition-all ease-in-out duration-400">
                    <Button
                        className="rounded-xl transition-all ease-in-out duration-400"
                        variant={`${filterCtx.type === "upcoming" ? "default" : "outline"}`}
                        onClick={() => filterCtx.updateFilterType('upcoming')}
                    >
                        <ArrowDown01 /> Upcoming
                    </Button>
                    <Button
                        className="rounded-xl transition-all ease-in-out duration-400"
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
                    <div className="my-2 space-x-1">
                        <Button
                            onClick={() => filterCtx.updatePlatform("codeforces")}
                            className={`rounded-2xl cursor-pointer ${platforms.includes("codeforces") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Codeforces
                        </Button>
                        <Button
                            onClick={() => filterCtx.updatePlatform("codechef")}
                            className={`rounded-2xl cursor-pointer ${platforms.includes("codechef") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Codechef
                        </Button>
                        <Button
                            onClick={() => filterCtx.updatePlatform("leetcode")}
                            className={`rounded-2xl cursor-pointer ${platforms.includes("leetcode") ? "hover:bg-gray-700 hover:dark:bg-gray-400" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70  dark:bg-gray-600/40 dark:text-gray-400 hover:dark:bg-gray-600/50"} `}>
                            Leetcode
                        </Button>

                    </div>
                    <div>
                        <div
                            className="flex items-center justify-center space-x-1 cursor-pointer"
                            onClick={() => filterCtx.resetPlatform()}
                        >
                            <X size={15} /> <p>Reset</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Filter