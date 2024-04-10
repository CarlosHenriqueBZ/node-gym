-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    CONSTRAINT "Exercise_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "training" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
