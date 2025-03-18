import { Bookmark, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/lib/http/auth";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/user-context";

const NavBar = () => {
    const navigate = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const userCtx = useContext(UserContext);

    const { data, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: ()=>getUserDetails(userCtx.logIn),
        staleTime: 5 * 60 * 1000,
        enabled: isLoggedIn
    })


    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        userCtx.logOut();
        navigate('/auth/login');

    }

    useEffect(() => {
        if (isLoggedIn) {
            if(data){
                console.log(data)
                userCtx.logIn((data as { user: string }).user)
            }
            refetch();
        }
    }, [isLoggedIn, refetch]);


    return (
        <>
            <div className="hidden md:block w-full">
                <nav className="flex justify-between w-full px-4 py-2 bg-slate-300/10 fixed top-0 backdrop-blur-xs z-10">
                    <Link to="/" className="flex justify-center items-center space-x-1">
                        <Calendar className="text-blue-500" />
                        <p className="font-semibold text-xl" >TLE Contest Tracker</p>
                    </Link>
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
                </nav>
            </div>
            <div className="block w-screen md:hidden ">
                <div className={`w-screen h-screen bg-slate-300/70 fixed top-0 left-0 backdrop-blur-xs z-10 transition-all duration-800 ease-in-out  animate-in slide-in-from-left ${isMobileNavOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col items-center justify-center pt-15 space-y-1 w-screen h-screen transition-all duration-800 ease-in-out">
                        {isLoggedIn && data ? <>
                            <Link to="/bookmarks" className="py-2 px-3 outline-1 hover:bg-blue-400/10 rounded-lg flex space-x-1 items-center">
                                <Bookmark size={15} />
                                <p className=" text-sm">Bookmarks</p>
                            </Link>
                            <Button variant={'outline'} className="rounded-lg cursor-pointer" onClick={handleLogout}>Logout</Button>
                        </> : <>
                            <Button variant={'outline'}><Link to={'/auth/login'}>Login</Link></Button>
                            <Button variant={'default'}><Link to={'/auth/signup'}>Sign Up</Link></Button>

                        </>}
                        <ModeToggle></ModeToggle>
                    </div>
                </div>
                <nav className="fixed flex justify-between items-center px-4 sm:px-6 md:px-8 bg-slate-300/10 w-full py-2.5 z-10 backdrop-blur-xs">
                    <Link to="/" className="flex justify-center items-center space-x-1">
                        <Calendar className="text-blue-500 w-5 sm:w-6 md:w-8" />
                        <p className="font-semibold text-sm sm:text-md md:text-lg" >TLE Contest Tracker</p>
                    </Link>
                    <div
                        className="flex justify-center items-center w-8 h-8 cursor-pointer"
                        onClick={() => setIsMobileNavOpen(prevState => !prevState)}
                    >
                        {isMobileNavOpen ? (
                            <div className="relative w-6 h-6 flex items-center">
                                <div className="w-6 h-0.5 bg-black rotate-45 absolute dark:bg-white transition-all duration-300 ease-in-out"></div>
                                <div className="w-6 h-0.5 bg-black -rotate-45 absolute dark:bg-white transition-all duration-300 ease-in-out"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-1.5 w-6">
                                <div className="w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out"></div>
                                <div className="w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out"></div>
                                <div className="w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out"></div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default NavBar