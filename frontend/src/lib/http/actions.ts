import { redirect } from "react-router-dom";
import { getUserDetails } from "./auth"



export const authLoader = async () => {
    const user = await getUserDetails();
    if (!user) {
        throw redirect('/auth/login');
    }
    return null;
}