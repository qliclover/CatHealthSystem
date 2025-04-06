/*
  Warnings:

  - You are about to drop the column `birthdate` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `food_preference` on the `Cat` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "weight" REAL,
    "birthday" DATETIME,
    "arrival_date" DATETIME,
    "usual_food" TEXT,
    "dewormed" BOOLEAN,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("age", "arrival_date", "dewormed", "id", "name", "userId", "weight") SELECT "age", "arrival_date", "dewormed", "id", "name", "userId", "weight" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
