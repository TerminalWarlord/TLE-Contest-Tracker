# **TLE Contest Tracker**

A web application to track programming contests from platforms like **Codeforces**, **CodeChef**, and **LeetCode**. Users can view upcoming contests, filter them by platform, and bookmark contests for future reference. Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

## **Features**

- **Upcoming Contests**: View upcoming contests from Codeforces, CodeChef, and LeetCode.
- **Past Contests**: View past contests with details.
- **Filters**: Filter contests by platform(s) like Codeforces, CodeChef, or LeetCode.
- **Bookmarks**: Bookmark contests for easy access.
- **Time Remaining**: See time remaining for upcoming contests.
  
---

## **Tech Stack**

- **Frontend**: React.js, Tailwind CSS, React Router, Tanstack Query
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), Zod
- **APIs**: Codeforces API, CodeChef API, LeetCode GraphQL API


---


## Used APIs

### 1. **Codeforces**: 
Codeforces has fairly well document public [API](https://codeforces.com/apiHelp/methods#contest.list). 

```bash
curl https://codeforces.com/api/contest.list?gym=false
```

### 2. **Codechef**: 
Even though Codechef doesn't provide any API, but you can easily inspect the network tab and figure out the endpoints



**Upcoming Contests:**
```bash
curl --location https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all \
--header 'Content-Type: application/json'
```
**Past Contests:**
```bash
curl --location https://www.codechef.com/api/list/contests/past?sort_by=START&sorting_order=desc&offset=0&mode=all \
--header 'Content-Type: application/json'
```


This will return `20` items per page, you can use upto offset number `1960`

### 3. **Leetcode**: 
Leetcode uses graphQL, which I find a bit overwhelming but wasn't too hard to figure out endpoint for `Past Contests`. The catch here was, the endpoint to get `Upcoming Contests` was server rendered. Took me a while, but was able to figure it out.

**twoTopContest:**
```bash
curl --location 'https://leetcode.com/graphql/' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query topTwoContests { topTwoContests { title titleSlug startTime duration } }",
  "operationName": "topTwoContests"
}'
```
Past Contests:
```sh
curl --location 'https://leetcode.com/graphql/' \
--header 'Content-Type: application/json' \
--data '{"query":"\n    query pastContests($pageNo: Int, $numPerPage: Int) {\n  pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {\n    pageNum\n    currentPage\n    totalNum\n    numPerPage\n    data {\n      title\n      titleSlug\n      startTime\n      originStartTime\n      cardImg\n      sponsors {\n        name\n        lightLogo\n        darkLogo\n      }\n    }\n  }\n}\n    ","variables":{"pageNo":1}}'
```

4. **Youtube DATA v3**: Used **Youtube DATA v3** to get all the [TLE Eliminators playlists](https://www.youtube.com/@TLE_Eliminators/playlists)' videos and store video ID, title and description in the database.

## Thoughts:
1. While fetching the contests from CF/CC/LC, I look in the populated DB to find if any video title/description matches the contest name or url (e.g. CF contest videos have contest links in video description, `https://codeforces.com/contest/XXXX/problem/A`)

2. The better approach would be **Semantic Search using vector embeddings**, but for the time being I've used simple string matching

3. Now, to populate the database periodically we can run a cronjob or simple use https://betterstack.com make a request every 2-30 minutes (ideally should be 24hrs) at `/v1/update` endpoint (on free plan).

4. CF sometime posts contests without proper title, here's an example https://imgur.com/a/W4Ti0Mb . So, its not a bug from my end. But will have to tackle this when the updates the title.
---

## Demo
_Click to open them in YouTube_
### Basic Frontend Functionalities
[![Watch the video](https://img.youtube.com/vi/PjjFXlFiu6U/0.jpg)](https://youtu.be/PjjFXlFiu6U?si=dV5ECfdMYYE0K_ej)

### Automatic Contest Update and Video Mapping
[![Watch the video](https://img.youtube.com/vi/TTwHTDIk2mo/0.jpg)](https://youtu.be/TTwHTDIk2mo?si=dV5ECfdMYYE0K_ej)

---

## **Getting Started**

### 1. Clone the Repository

```bash
git clone https://github.com/TerminalWarlord/TLE-Contest-Tracker.git
```

2. Install Dependencies

Frontend:
```bash
cd frontend
npm install
```
Backend:
```bash
cd backend
npm install
```
3. Set up Environment Variables

Create a `.env` file in the backend/ directory with `DATABASE_URL`, `YOUTUBE_API_KEY` and `JWT_SECRET` environment values. `PORT` is optional.

and similarly create a `.env` file in the frontend/ directory with `VITE_API_URL`, link to backend app.


4. Run the Application

Frontend:
```bash
cd frontend
npm start
```
Backend:
```bash
cd backend
npm start
```

The app will be available at http://localhost:5173 for the frontend and http://localhost:3000 (unless PORT is defined in the environment variable) for the backend.


5. Get latest contests and update youtube links
```bash
cd backend
npm run start:updateDb
```


6. Automate the updating process
```bash
cd backend
pwd # get the absolute path of the current directory
crontab -e # This will open editor

# Add the line below to update the DB every 24 hrs
0 0 * * * cd /copied_absolute_path && npm run start:updateDb
crontab -l # Confirm it's been added to the cronjob
```

---


## Contact

For questions or suggestions, feel free to open an issue on GitHub or contact me directly at jaybee.dev@proton.me.
