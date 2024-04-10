-- CreateTable
CREATE TABLE "training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "calories" INTEGER,
    "slug" TEXT NOT NULL,
    "duration" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "training_slug_key" ON "training"("slug");
