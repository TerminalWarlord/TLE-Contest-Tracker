import { Bookmark, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/lib/http";
import { Button } from "./ui/button";

const NavBar = () => {
    const location = useLocation();
    const path = location.pathname;
    console.log(path);
    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: getUserDetails,
        staleTime: 5 * 60 * 1000,

    })


    return (
        <div className="flex justify-between w-full px-4 py-2 bg-slate-300/10 fixed top-0 backdrop-blur-xs z-10">
            <div className="flex justify-center items-center space-x-1">
                <Calendar className="text-blue-500" />
                <p className="font-semibold text-xl" >TLE Contest Tracker</p>
            </div>
            <div className="flex space-x-2 ">
                <ModeToggle></ModeToggle>
                {data ? <>
                    <Link to="bookmarks" className="py-2 px-3 bg-blue-400/10 rounded-3xl flex space-x-1 items-center">
                        <Bookmark size={15} className="text-blue-400" />
                        <p className="text-blue-400 text-sm">Bookmarks</p>
                    </Link>
                </> : <>
                    <Button variant={'outline'}>Login</Button>
                    <Button variant={'default'}>Sign Up</Button>
                    
                </>}

            </div>
        </div>
    )
}

export default NavBar