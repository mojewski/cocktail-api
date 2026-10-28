import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCocktailIngredientDto {
  @IsInt({ message: 'Ingredient ID should be a number' })
  @IsNotEmpty({ message: 'Ingredient ID is required' })
  ingredientId: number;

  @IsPositive({ message: 'Amount of ingredient should be a positive number' })
  @IsNotEmpty({ message: 'Amount of ingredient is required' })
  amount: number;

  @IsString({ message: 'Unit of ingredient should be a string' })
  @IsNotEmpty({ message: 'Unit of ingredient is required' })
  unit: string;
}