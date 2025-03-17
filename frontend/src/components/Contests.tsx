import ContestCard from "./ContestCard"
import { useQuery } from "@tanstack/react-query";
import { getContests } from "@/lib/http/getContests";
import { CircleSlash2, Loader2 } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Contest } from "@/types/contest";
import { useContext, useState } from "react";
import { FilterContext } from "@/store/filter-context";




const Contests = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const isBookmark = location.pathname.includes('bookmarks');
    console.log(location.pathname, isBookmark);

    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "0"))
    const [offset, setOffset] = useState(parseInt(searchParams.get("offset") || "0"));
    const filterCtx = useContext(FilterContext);
    const { data, error, isPending } = useQuery({
        queryKey: ['contests', offset, 20, filterCtx.platforms, filterCtx.type, isBookmark],
        queryFn: () => getContests(offset, 20, filterCtx.platforms, filterCtx.type, isBookmark),
        staleTime: 5 * 60 * 1000
    });


    const handleNavigation = (identifier: "next" | "prev") => {
        if (data && data.hasNextPage && identifier === "next") {
            setCurrentPage(prevPage => prevPage + 1);
            setOffset(prevOffset => prevOffset + 20);
        }
        if (identifier === "prev") {
            setCurrentPage(prevPage => {
                if (prevPage > 0) {
                    setOffset(prevOffset => prevOffset - 20);
                }
                return prevPage > 0 ? prevPage - 1 : 0;
            });
        }
    }



    let content;
    if (error) {
        content = <div className="flex flex-col items-center justify-center min-h-[30vh]">
            <div className="mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Failed to load contests</h2>
            <p className="text-gray-600 mb-4">There was an error loading the contest data.</p>
            <button
                className="px-4 py-2 bg-primary text-white dark:text-gray-600 rounded-md hover:bg-primary/90"
                onClick={() => window.location.reload()}
            >
                Try Again
            </button>
        </div>
    }
    if (isPending) {
        content = <div className="flex flex-col items-center justify-center min-h-[30vh]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading contests...</p>
        </div>
    }
    console.log(data && data.contests && data.contests?.length > 0)
    if (data && data.contests && !data.contests?.length) {
        content = <div className="flex flex-col items-center justify-center min-h-[30vh]">
            <CircleSlash2 className="w-12 h-12 text-primary mb-4" />
            <p className="text-lg text-gray-600">Nothing found!</p>
        </div>

    }
    if (data && data.contests && data.contests?.length > 0) {
        content = <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{
                animation: "slideUp 1s ease-in-out forwards"
            }}>
                {data.contests.map((contest: any) => {
                    return <ContestCard key={contest.id} contest={contest as unknown as Contest} />
                })}
            </div >
            <Pagination className="flex w-full justify-end items-end my-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={`${currentPage > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => handleNavigation("prev")}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            className={`${data.hasNextPage ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => handleNavigation("next")}
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </>
    }



    return (
        <div className="w-7/8 my-4">
            {content}
        </div>
    )
}

export default Contests