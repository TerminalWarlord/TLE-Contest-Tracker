import { CODECHEF_PLAYLIST_ID, CODEFORCES_PLAYLIST_ID, LEETCODE_PLAYLIST_ID } from "../config";
import { PlatformType } from "../types/contest";
import { prismaClient } from "./db";

const getPlaylistId = (platform: PlatformType) => {
    let playlistId = LEETCODE_PLAYLIST_ID;
    if (platform === "CODEFORCES") {
        playlistId = CODEFORCES_PLAYLIST_ID;
    }
    else if (platform === 'CODECHEF') {
        playlistId = CODECHEF_PLAYLIST_ID;
    }

    return playlistId;
}


const fetchPlaylist = async (platform: PlatformType) => {
    const playlistId = getPlaylistId(platform);
    const API_KEY = process.env.YOUTUBE_API_KEY || "";
    let nextPageToken = null;


    // We will get the playlist items using Youtube API V3  
    let baseUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50`

    try {
        while (true) {
            // To iterate over all the videos in the playlist we would need nextPageToken
            // The max results we can fetch at a time is 50

            // TODO: Fix ts error
            // @ts-ignore
            const res = await fetch(baseUrl + (nextPageToken ? `&pageToken=${nextPageToken}` : ""));

            if (!res.ok) {
                console.log("Failed to get playlist items");
                return [];
            }

            // @ts-ignore
            const resData = await res.json();


            // Extract video ID, title and description and push them to results
            resData.items.map((item: any) => {
                const videoId = item.snippet.resourceId.videoId;
                const videoTitle = item.snippet.title;
                const videoDescription = item.snippet.description;

                // results.push({
                //     videoId,
                //     videoTitle,
                //     videoDescription
                // });
                prismaClient.video.upsert({
                    where: { id: videoId },
                    update: {
                        title: videoTitle,
                        description: videoDescription
                    },
                    create: {
                        platform,
                        id: videoId,
                        title: videoTitle,
                        description: videoDescription,
                    }
                }).then(res => {
                    console.log(res, "added to the db");
                })

            });

            // Update nextPagetoken
            if (resData.nextPageToken) {
                nextPageToken = resData.nextPageToken;
            }
            else {
                // There's no next token, means no items left
                // so we can break out of the loop
                break;
            }
        }
    }
    catch (err) {
        console.log("Failed to get playlist items");
    }
}


const mapWithYoutubePlaylist = async (platform: PlatformType, contestTitle: string, contestUrl: string) => {

    // INITIAL THOUGHTS:
    // The best approach would be to use vector database and embeddings to map contest with
    // TLE Eliminator's playlists, but for the time being I will implement simple js methods
    // I will implement vector embedding semantic search later


    // Fetch the videos for a specific platform and look for a match
    const videos = await prismaClient.video.findMany({
        where: {
            platform: platform
        }
    });

    const video = videos.find(vid => {
        const videoTitle = vid.title.toLocaleLowerCase();
        const videoDesc = (vid.description || "").toLocaleLowerCase();
        const lowerCasedContestTitle = contestTitle.toLocaleLowerCase();

        console.log(videoTitle,lowerCasedContestTitle, videoTitle.includes(lowerCasedContestTitle))

        // check if contest title matches the video title or description
        // or contest link mentioned in the video description, it will be the case for codeforces
        return videoTitle.includes(lowerCasedContestTitle) ||
            videoDesc.includes(lowerCasedContestTitle) ||
            videoDesc.includes(contestUrl);
    })

    return video;
}


// This should be executed as a cron job, but for the time being we will use it in out script
// Or we can expose and endpoint and hit it every 24hrs to update the playlist content in the database
const populateDbWithVideos = async () => {
    // await fetchPlaylist("CODEFORCES");
    // await fetchPlaylist("CODECHEF");
    await fetchPlaylist("LEETCODE");
}


export {
    mapWithYoutubePlaylist,
    populateDbWithVideos
};