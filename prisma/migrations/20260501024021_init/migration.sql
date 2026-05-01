-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'CELEBRANT');

-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('NOTHING', 'DISLIKE', 'LIKE', 'LOVE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "names" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "pic" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "friendId" UUID,
    "town" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "reaction" "Reaction" NOT NULL DEFAULT 'NOTHING',

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wish_userId_key" ON "Wish"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wish_friendId_key" ON "Wish"("friendId");

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
