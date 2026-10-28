import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async create(createIngredientDto: CreateIngredientDto) {
    return this.prismaService.ingredient.create({
      data: createIngredientDto,
    });
  }

  async findAll() {
    return this.prismaService.ingredient.findMany();
  }

  async findOne(id: number) {
    const ingredient = await this.prismaService.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient ${id} not found`);
    }

    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    await this.findOne(id);

    return this.prismaService.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaService.ingredient.delete({
    where: { id },
  });
  }
}
