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
- **Backend**: Node.js, Express.js, Prisma (MongoDB), Zod
- **APIs**: Codeforces API, CodeChef API, LeetCode GraphQL API

Just for the record, any prisma supported database can be used to run the application

---

## **Background Study and Strategies**
1. [Codeforces API](https://codeforces.com/apiHelp/methods#contest.list) was public, Codechef's one was somehow public, was easy to figure out using browser's network tab. Leetcode was bit tough since I have't never used graphQL, don't know how it works. Still getting the **PAST contests** was too easy. Had to dig deep for the upcoming two contest. _(Although I could've used some basic calculation since there are only two types of contests (weekly/biweekly))_

2. Used **Youtube DATA v3** to get all the [TLE Eliminators playlists](https://www.youtube.com/@TLE_Eliminators/playlists)' videos and store video ID, title and description in the database.

3. While fetching the contests from CF/CC/LC, I look in the populated DB to find if any video title/description matches the contest name or url (e.g. CF contest videos have contest links in video description, `https://codeforces.com/contest/XXXX/problem/A`)

4. The better approach would be **Semantic Search using vector embeddings**, but for the time being I've used simple string matching

5. Now, to populate the database periodically we can run a cronjob or simple use https://betterstack.com make a request every 2-30 minutes (on free plan).


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

4. Generate the Prisma Client
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Run the Application

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


---


## Contact

For questions or suggestions, feel free to open an issue on GitHub or contact me directly at jaybee.dev@proton.me.
