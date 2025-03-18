import { Response, Router, Request } from "express";
import { editContestYoutubeUrl, getContests } from "../controllers/contestController";
import { authWall } from "../controllers/userController";
import { populateDbWithVideos } from "../utils/youtube";
import codeforces from "../utils/codeforces";
import leetcode from "../utils/leetcode";
import codechef from "../utils/codechef";


const router = Router();


router.get('/contests', getContests);
router.post('/contest/edit', authWall, editContestYoutubeUrl);


// These should be executed with a CRON job periodically
// for the time being I'm keeping them here
// For simplicity's sake, we can use https://betterstack.com/ to make a periodic request 
// to update out DB
router.get('/populate', async (req: Request, res: Response) => {
    // This fetches all the items from TLE playlists and store videoId, videoTitle 
    // and videoDescription and store them on DB
    await populateDbWithVideos();


    // Get all the contests from codeforces/leetcode/codechef and map them with 
    // the video ID based on whether the video title or decription contains the 
    // contest title or contest link 
    await codeforces();
    await leetcode();
    await codechef();
})
export const contestRoutes = router;