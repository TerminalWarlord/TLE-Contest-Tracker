-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "platform" "Platform" NOT NULL DEFAULT 'CODEFORCES',

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
