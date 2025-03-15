import { Github } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className=" flex justify-between w-full px-8 py-4">
        <div>
            <span>&copy; 2025 Contest Tracker. All rights reserved.</span>
        </div>
        <div className="flex space-x-1 justify-center items-center">
            <a href="https://github.com/TerminalWarlord/TLE-Contest-Tracker"><Github size={18}/></a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
        </div>
    </div>
  )
}

export default Footer