/*
  Warnings:

  - The primary key for the `Cocktail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Cocktail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CocktailIngredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CocktailIngredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Ingredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Cocktail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cocktailId` on the `CocktailIngredient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ingredientId` on the `CocktailIngredient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CocktailIngredient" DROP CONSTRAINT "CocktailIngredient_cocktailId_fkey";

-- DropForeignKey
ALTER TABLE "CocktailIngredient" DROP CONSTRAINT "CocktailIngredient_ingredientId_fkey";

-- AlterTable
ALTER TABLE "Cocktail" DROP CONSTRAINT "Cocktail_pkey",
ADD COLUMN     "category" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Cocktail_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CocktailIngredient" DROP CONSTRAINT "CocktailIngredient_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "cocktailId",
ADD COLUMN     "cocktailId" INTEGER NOT NULL,
DROP COLUMN "ingredientId",
ADD COLUMN     "ingredientId" INTEGER NOT NULL,
ADD CONSTRAINT "CocktailIngredient_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CocktailIngredient_cocktailId_ingredientId_key" ON "CocktailIngredient"("cocktailId", "ingredientId");

-- AddForeignKey
ALTER TABLE "CocktailIngredient" ADD CONSTRAINT "CocktailIngredient_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "Cocktail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocktailIngredient" ADD CONSTRAINT "CocktailIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
