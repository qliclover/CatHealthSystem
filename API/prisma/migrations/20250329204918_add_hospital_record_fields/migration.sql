/*
  Warnings:

  - You are about to drop the column `record_type` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `HealthRecord` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HealthRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "visit_date" DATETIME,
    "hospital_name" TEXT,
    "vet_name" TEXT,
    "visit_reason" TEXT,
    "symptom_description" TEXT,
    "symptom_duration" TEXT,
    "symptom_trigger" TEXT,
    "catId" INTEGER NOT NULL,
    CONSTRAINT "HealthRecord_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HealthRecord" ("catId", "id") SELECT "catId", "id" FROM "HealthRecord";
DROP TABLE "HealthRecord";
ALTER TABLE "new_HealthRecord" RENAME TO "HealthRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
