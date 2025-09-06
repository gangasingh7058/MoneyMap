/*
  Warnings:

  - You are about to drop the column `expertise` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `sebi_id` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Teacher" DROP COLUMN "expertise",
ADD COLUMN     "sebi_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."TeacherExpertise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TeacherExpertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TeacherExpertises" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeacherExpertises_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeacherExpertise_name_key" ON "public"."TeacherExpertise"("name");

-- CreateIndex
CREATE INDEX "_TeacherExpertises_B_index" ON "public"."_TeacherExpertises"("B");

-- AddForeignKey
ALTER TABLE "public"."_TeacherExpertises" ADD CONSTRAINT "_TeacherExpertises_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeacherExpertises" ADD CONSTRAINT "_TeacherExpertises_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TeacherExpertise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
