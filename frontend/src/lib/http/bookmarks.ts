import axios from "axios";
import { getToken } from "./auth";


export const updateBookmark = async (contestId: number) => {
    try {
        const { data } = await axios.post('http://localhost:3000/v1/bookmark', {
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