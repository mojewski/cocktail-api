import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CocktailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCocktailDto: CreateCocktailDto) {
    const { ingredients, ...cocktailData } = createCocktailDto;

    return this.prismaService.cocktail.create({
      data: {
        ...cocktailData,
        ...(ingredients && ingredients.length > 0
          ? {
              ingredients: {
                createMany: {
                  data: ingredients,
                },
              },
            }
          : {}),
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.cocktail.findMany();
  }

  async findOne(id: number) {
    const cocktail = await this.prismaService.cocktail.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          }
        }
      }
    });

    if (!cocktail) {
      throw new NotFoundException(`Cocktail ${id} not found`);
    }

    return cocktail;
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto) {
    await this.findOne(id);

    const { ingredients, ...cocktailData } = updateCocktailDto;

    return this.prismaService.cocktail.update({
      where: { id },
      data: {
        ...cocktailData,
        ...(ingredients
          ? {
              ingredients: {
                deleteMany: {},
                createMany: {
                  data: ingredients,
                },
              },
            }
          : {}),
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prismaService.cocktail.delete({
      where: { id },
    });
  }
}
