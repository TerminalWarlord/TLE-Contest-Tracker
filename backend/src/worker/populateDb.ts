import codechef from "../utils/codechef";
import codeforces from "../utils/codeforces";
import { connectDb } from "../utils/db";
import leetcode from "../utils/leetcode";
import { populateDbWithVideos } from "../utils/youtube";

// This should be executed as a CRONJOB (probably once every 24hrs)
(async () => {
    try {
        await connectDb();

        // console.log("Starting video population...");
        // await populateDbWithVideos();
        // console.log("Videos have been updated!");


        // Makde updates on different platform independently since 
        // one doesnt rely on other
        await Promise.all([
            await codeforces(),
            await codechef(),
            await leetcode(),
        ])


        console.log("CRON job completed successfully!");
    } catch (error) {
        console.error("Error occurred during execution:", error);
    }
})();