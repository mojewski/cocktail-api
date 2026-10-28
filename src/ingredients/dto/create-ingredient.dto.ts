import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString({ message: 'Name should be a string'})
  @IsNotEmpty({ message: 'Name is required'})
  @Length(2, 50, { message: 'Name should be between 2 and 50 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description should be a string'})
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Field withAlcohol should be a boolean(True or False)'})
  withAlcohol?: boolean;

  @IsOptional()
  @IsUrl({}, { message: 'URL format required'})
  imageUrl?: string;
}
