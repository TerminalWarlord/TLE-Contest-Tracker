import { FilterType, PlatformType } from "@/types/contest";
import { createContext } from "react";

export const FilterContext = createContext({
    type: "upcoming",
    platforms: ["codeforces", "leetcode", "codechef"],
    updatePlatform: (platform: PlatformType) => { },
    updateFilterType: (filterType: FilterType)=> {},
    resetPlatform: ()=> {},
});



