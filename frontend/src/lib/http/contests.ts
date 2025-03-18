import { ContestParamsType, FilterType, PlatformType } from "@/types/contest";
import axios from "axios";
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;


export const getContests = async (offset: number = 0, limit: number = 10, platforms: PlatformType[] = ["CODEFORCES", "CODECHEF", "LEETCODE"], filterType: FilterType = "upcoming", isBookmark = false) => {
    console.log("fetching")
    try {
        const paramsObj: ContestParamsType = {
            offset: String(offset),
            limit: String(limit),
            platforms: platforms.join(','),
            filterType: String(filterType),
        };
        if (isBookmark) {
            paramsObj.isBookmark = String(true);
        }
        const params = new URLSearchParams(paramsObj as unknown as string).toString();

        const options = isBookmark ? {
            headers: { "Authorization": "Bearer " + getToken() }
        } : undefined;
        const res = await fetch(`${API_URL}/v1/contests?${params}`, options);

        if (!res.ok) {
            console.log(await res.json());
            throw Error("Failed to get contest");
        }
        const resData = await res.json();
        return {
            offset,
            limit,
            ...resData
        };
    }
    catch (err) {
        console.log(err)
        throw Error("Failed to get contest");
    }
}



export const editContestYoutubeUrl = async (contestId: number, youtubeUrl: string) => {
    try {
        const { data } = await axios.post(API_URL + "/v1/contest/edit", {
            contestId,
            youtubeUrl
        }, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        return data;
    }
    catch (err) {
        throw Error("Failed to update contest");
    }
}  