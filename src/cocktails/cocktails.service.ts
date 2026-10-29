import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

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

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, limit, search, category, ingredientId, sortBy, sortOrder } = paginationQuery;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }
    if (ingredientId) {
      where.ingredients = {
        some: {
          ingredientId: Number(ingredientId),
        }
      };
    }

    return paginate(
        this.prismaService.cocktail,
        {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              }
            }
          },
          where,
          orderBy: sortBy
            ? { [sortBy]: sortOrder || 'asc' }
            : { id: 'asc' },
        },
        page,
        limit,
      );
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
