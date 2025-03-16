-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "hasEnded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "youtube_url" TEXT;
