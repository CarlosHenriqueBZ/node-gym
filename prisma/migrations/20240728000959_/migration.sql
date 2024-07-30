/*
  Warnings:

  - A unique constraint covering the columns `[identity]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_identity_key" ON "user"("identity");
