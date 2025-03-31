/*
  Warnings:

  - Added the required column `age` to the `Cat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "breed" TEXT,
    "birthdate" DATETIME,
    "weight" REAL,
    CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("birthdate", "breed", "id", "name", "userId", "weight") SELECT "birthdate", "breed", "id", "name", "userId", "weight" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
