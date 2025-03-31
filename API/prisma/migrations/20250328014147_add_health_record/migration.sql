/*
  Warnings:

  - You are about to drop the column `recorded_at` on the `HealthRecord` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HealthRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "record_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "catId" INTEGER NOT NULL,
    CONSTRAINT "HealthRecord_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HealthRecord" ("catId", "id", "record_type", "value") SELECT "catId", "id", "record_type", "value" FROM "HealthRecord";
DROP TABLE "HealthRecord";
ALTER TABLE "new_HealthRecord" RENAME TO "HealthRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
