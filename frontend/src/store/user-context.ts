import { createContext } from "react";

interface UserContextType {
    isAuthenticated: boolean,
    user: string | null,
    logIn: (role: string) => void,
    logOut: () => void,
}
export const UserContext = createContext<UserContextType>({
    isAuthenticated: false,
    user: null,
    logIn: () => { },
    logOut: () => { },
})