import { Bookmark, Calendar } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/lib/http";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const NavBar = () => {
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
    const { data, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: getUserDetails,
        staleTime: 5 * 60 * 1000,
        enabled: isLoggedIn
    })


    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate('/auth/login');

    }

    useEffect(() => {
        if (isLoggedIn) {
            refetch();
        }
    }, [isLoggedIn, refetch]);


    return (
        <div className="flex justify-between w-full px-4 py-2 bg-slate-300/10 fixed top-0 backdrop-blur-xs z-10">
            <div className="flex justify-center items-center space-x-1">
                <Calendar className="text-blue-500" />
                <p className="font-semibold text-xl" >TLE Contest Tracker</p>
            </div>
            <div className="flex space-x-2 ">
                <ModeToggle></ModeToggle>
                {isLoggedIn && data ? <>
                    <Link to="/bookmarks" className="py-2 px-3 outline-1 hover:bg-blue-400/10 rounded-lg flex space-x-1 items-center">
                        <Bookmark size={15} className="text-blue-400" />
                        <p className="text-blue-400 text-sm">Bookmarks</p>
                    </Link>
                    <Button variant={'outline'} className="rounded-lg cursor-pointer" onClick={handleLogout}>Logout</Button>
                </> : <>
                    <Button variant={'outline'}><Link to={'/auth/login'}>Login</Link></Button>
                    <Button variant={'default'}><Link to={'/auth/signup'}>Sign Up</Link></Button>

                </>}

            </div>
        </div>
    )
}

export default NavBar