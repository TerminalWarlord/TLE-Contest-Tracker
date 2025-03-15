import { useEffect, useState } from "react"

export const useFetch = ({ initialState, fetchFn }: { initialState: any, fetchFn: () => {} }) => {
    const [data, setData] = useState(initialState);
    const [errors, setErrors] = useState();
    const [isFetching, setIsFetching] = useState();


    useEffect(() => {
        fetchFn();
    }, []);

    return {
        data,
        setData,
        errors,
        setErrors,
        isFetching,
        setIsFetching
    }

}