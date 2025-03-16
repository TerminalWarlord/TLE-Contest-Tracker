import { LoginForm } from "@/components/login-form"
import NavBar from "@/components/NavBar";
import { useParams } from "react-router-dom"

const Authentication = () => {
    const params = useParams();
    const mode = params.mode || "login";
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <NavBar/>
            <div className="w-full max-w-sm">
                <LoginForm mode={mode}/>
            </div>
        </div>
    )
}

export default Authentication