import axios from "axios";


interface LoginResponse {
    message: string;
    token: string;
}

export const signIn = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    try {
        // Ensure email and password are strings
        const email = data.email as string;
        const password = data.password as string;

        const res = await axios.post<LoginResponse>("http://localhost:3000/v1/login", {
            email,
            password
        });

        const token = res.data.token;
        localStorage.setItem("token", token);
    }
    catch (err) {
        throw Error("Failed to login");
    }
}



export const signUp = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    try {
        // Ensure email and password are strings
        const email = data.email as string;
        const password = data.password as string;
        const password2 = data.password2 as string;
        if (password !== password2) {
            throw Error("Both password don't match!");
        }
        const name = data.name as string;


        await axios.post<LoginResponse>("http://localhost:3000/v1/signup", {
            email,
            password,
            name,
        });
    }
    catch (err) {
        console.log(err);
        throw Error("Failed to login");
    }
}



export const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
}





export const getUserDetails = async () => {
    try {
        const { data } = await axios.get("http://localhost:3000/v1/me", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        // throw Error("User not authenticated");
        return data;
    }
    catch (err) {
        return null;
    }
}