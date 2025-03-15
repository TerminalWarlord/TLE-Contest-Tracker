import { Github } from "lucide-react"

const Footer = () => {
  return (
    <div className=" flex justify-between w-full px-8 py-4">
        <div>
            <span>&copy; 2025 Contest Tracker. All rights reserved.</span>
        </div>
        <div className="flex space-x-1 justify-center items-center">
            <a href=""><Github size={18}/></a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </div>
    </div>
  )
}

export default Footer