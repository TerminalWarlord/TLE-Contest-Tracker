/*
  Warnings:

  - A unique constraint covering the columns `[contestId,userId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_contestId_userId_key" ON "Bookmark"("contestId", "userId");
