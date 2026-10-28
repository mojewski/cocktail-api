import { IsArray, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCocktailIngredientDto } from './create-cocktail-ingredient.dto';

export class CreateCocktailDto {
  @IsString({ message: 'Name should be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 50, { message: 'Name should be between 2 and 50 characters long' })
  name: string;

  @IsString({ message: 'Category should be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  @Length(2, 30, { message: 'Category should be between 2 and 30 characters long' })
  category: string;

  @IsOptional()
  @IsString({ message: 'Description should be a string' })
  description?: string;

  @IsString({ message: 'Instructions should be a string' })
  @IsNotEmpty({ message: 'Instructions are required' })
  instructions: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type( () => CreateCocktailIngredientDto)
  ingredients: CreateCocktailIngredientDto[];
}
