import { Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
    const location = useLocation();
    const path = location.pathname;
    console.log(path);  
    return (
        <div className="flex justify-between w-full px-4 py-2 bg-slate-300/10 fixed top-0   backdrop-blur-xs">
            <div className="flex justify-center items-center space-x-1">
                <Calendar className="text-blue-500" />
                <p className="font-semibold text-xl" >TLE Contest Tracker</p>
            </div>
            <div className="flex space-x-2 ">
                <Link to="upcoming" className="py-2 px-3 bg-blue-400/10 rounded-3xl flex space-x-1 items-center">
                    <Calendar size={15} className="text-blue-400" />
                    <p className="text-blue-400 text-sm">Upcoming</p>
                </Link>
                <Link to="past" className="py-2 px-3 bg-blue-400/10 rounded-3xl flex space-x-1 items-center">
                    <Calendar size={15} className="text-blue-400" />
                    <p className="text-blue-400 text-sm">Past</p>
                </Link>
                <Link to="bookmarks" className="py-2 px-3 bg-blue-400/10 rounded-3xl flex space-x-1 items-center">
                    <Calendar size={15} className="text-blue-400" />
                    <p className="text-blue-400 text-sm">Bookmarks</p>
                </Link>
            </div>
        </div>
    )
}

export default NavBar