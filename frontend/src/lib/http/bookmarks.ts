import axios from "axios";
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;
export const updateBookmark = async (contestId: number) => {
    try {
        const { data } = await axios.post(API_URL + '/v1/bookmark', {
            contestId
        }, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        // Testing error case
        // throw Error("Simulated error");
        return data;
    }
    catch (err) {
        throw Error("Failed to update bookmark!");
    }
}