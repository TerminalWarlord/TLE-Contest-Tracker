import ContestCard from "./ContestCard"
import { useQuery } from "@tanstack/react-query";
import { getContests } from "@/lib/http";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Contest } from "@/types/contest";
import { useContext} from "react";
import { FilterContext } from "@/store/filter-context";




const Contests = () => {
    const [searchParams] = useSearchParams();
    console.log("CONTEST")
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");
    const filterCtx = useContext(FilterContext);
    const { data, error, isPending } = useQuery({
        queryKey: ['contests', page-1, limit, filterCtx.platforms, filterCtx.type],
        queryFn: () => getContests(page - 1, limit, filterCtx.platforms, filterCtx.type)
    });



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
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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
    if (data) {
        content = <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{
                animation: "slideUp 1s ease-in-out forwards"
            }}>
                {data.contests.map((contest) => {
                    return <ContestCard key={contest.id} contest={contest as unknown as Contest} />
                })}
            </div >
            <Pagination className="flex w-full justify-end items-end my-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#"/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
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