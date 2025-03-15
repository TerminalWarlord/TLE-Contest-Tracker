import { FilterType, PlatformType } from "@/types/contest";
import { createContext } from "react";

interface FilterContextType {
    type: FilterType;
    platforms: PlatformType[];
    updatePlatform: (platform: PlatformType) => void;
    updateFilterType: (filterType: FilterType) => void;
    resetPlatform: () => void;
}


export const FilterContext = createContext<FilterContextType>({
    type: "upcoming",
    platforms: [],
    updatePlatform: () => { },
    updateFilterType: ()=> {},
    resetPlatform: ()=> {},
});



