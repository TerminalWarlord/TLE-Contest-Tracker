FROM node:23-alpine

WORKDIR /app

ENV PORT=3000
ENV DATABASE_URL=MONGODBURI
ENV YOUTUBE_API_KEY=APIKEY
ENV JWT_SECRET=SOMESECRET

COPY package.json .

RUN npm install

COPY . .



EXPOSE ${PORT}

CMD [ "sh", "-c", "npm run start" ]