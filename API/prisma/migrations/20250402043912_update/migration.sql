/*
  Warnings:

  - You are about to drop the column `birthdate` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Cat` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Cat` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("age", "id", "name", "userId") SELECT "age", "id", "name", "userId" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
