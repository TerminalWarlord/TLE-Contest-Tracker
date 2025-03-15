import { Github } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="flex flex-col-reverse items-center md:flex-row justify-between w-full px-4 py-4">
        <div className="py-4">
            <span className="text-sm md:text-base">&copy; 2025 Contest Tracker. All rights reserved.</span>
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