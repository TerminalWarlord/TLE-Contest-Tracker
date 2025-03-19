import codechef from "../utils/codechef";
import codeforces from "../utils/codeforces";
import { connectDb } from "../utils/db";
import leetcode from "../utils/leetcode";
import { populateDbWithVideos } from "../utils/youtube";

// This should be executed as a CRONJOB (probably once every 24hrs)
(async () => {
    try {
        await connectDb();

        console.log("Starting video population...");
        await populateDbWithVideos();
        console.log("Videos have been updated!");

        
        console.log("Updating Codechef contests...");
        await codechef();
        console.log("Codechef contests have been updated!");
       
        console.log("Updating Codeforces contests...");
        await codeforces();
        console.log("Codeforces contests have been updated!");
        
        console.log("Updating Leetcode contests...");
        await leetcode();
        console.log("Leetcode contests have been updated!");

        console.log("CRON job completed successfully!");
    } catch (error) {
        console.error("Error occurred during execution:", error);
    }
})();