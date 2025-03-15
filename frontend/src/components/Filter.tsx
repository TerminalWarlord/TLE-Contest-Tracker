import { ArrowDown01, ArrowUp01, FilterIcon, X } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

type FilterType = "upcoming" | "past";
type PlatformType = "codeforces" | "codechef" | "leetcode";

const Filter = ({ filter = "upcoming" }: { filter?: FilterType }) => {
    const [currentFilter, setCurrentFilter] = useState<FilterType>(filter);
    const [selectedPlatforms, setSelectedPlatform] = useState<PlatformType[]>(["codeforces", "codechef", "leetcode"])
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    function handleFilterChange(val: FilterType) {
        setCurrentFilter(val);
    }


    function toggleFilter() {
        setIsFilterOpen(prevState => !prevState)
    }

    function handlePlatformFilter(val: PlatformType) {
        if (selectedPlatforms.includes(val)) {
            setSelectedPlatform(prevState => {
                const filteredPlatforms = prevState.filter(platform => platform !== val);
                return filteredPlatforms;
            })
        }
        else {
            setSelectedPlatform(prevState => {
                return [
                    ...prevState,
                    val
                ]
            })
        }
    }

    return (
        <div
            className="w-7/8 bg-white rounded-lg py-3 flex justify-between items-center px-4  flex-col"
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
                        variant={`${currentFilter === "upcoming" ? "default" : "outline"}`}
                        onClick={() => handleFilterChange('upcoming')}
                    >
                        <ArrowDown01 /> Upcoming
                    </Button>
                    <Button
                        className="rounded-xl transition-all ease-in-out duration-400"
                        variant={`${currentFilter === "past" ? "default" : "outline"}`}
                        onClick={() => handleFilterChange('past')}

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
                            onClick={() => handlePlatformFilter("codeforces")}
                            className={`rounded-2xl cursor-pointer ${selectedPlatforms.includes("codeforces") ? "hover:bg-gray-700" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70"} `}>
                            Codeforces
                        </Button>
                        <Button
                            onClick={() => handlePlatformFilter("codechef")}
                            className={`rounded-2xl cursor-pointer ${selectedPlatforms.includes("codechef") ? "hover:bg-gray-700" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70"} `}>
                            Codechef
                        </Button>
                        <Button
                            onClick={() => handlePlatformFilter("leetcode")}
                            className={`rounded-2xl cursor-pointer ${selectedPlatforms.includes("leetcode") ? "hover:bg-gray-700" : "bg-slate-300 text-gray-600 hover:bg-slate-400/70"} `}>
                            Leetcode
                        </Button>

                    </div>
                    <div>
                        <div
                            className="flex items-center justify-center space-x-1 cursor-pointer"
                            onClick={() => setSelectedPlatform([])}
                        >
                            <X size={15} /> <p>Clear</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Filter