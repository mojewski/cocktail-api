import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role, User } from '@prisma/client';

const INCLUDE = {
    ingredients: {
      include: {
        ingredient: true,
      },
    },
    author: {
      select: {
        id: true,
          name: true,
          email: true,
      }
    },
}

@Injectable()
export class CocktailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCocktailDto: CreateCocktailDto,
    user: User,
  ) {
    const { ingredients, ...cocktailData } = createCocktailDto;

    return this.prismaService.cocktail.create({
      data: {
        ...cocktailData,
        author: { connect: { id: user.id} },
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
      include: INCLUDE,
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, limit, search, category, ingredientId, sortBy, sortOrder } =
      paginationQuery;
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
        },
      };
    }

    return paginate(
      this.prismaService.cocktail,
      {
        include: INCLUDE,
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { id: 'asc' },
      },
      page,
      limit,
    );
  }

  async findOne(id: number) {
    const cocktail = await this.prismaService.cocktail.findUnique({
      where: { id },
      include: INCLUDE,
    });

    if (!cocktail) {
      throw new NotFoundException(`Cocktail ${id} not found`);
    }

    return cocktail;
  }

  async update(
    id: number,
    updateCocktailDto: UpdateCocktailDto,
    user: User,
  ) {
    const cocktail = await this.findOne(id);

    if (cocktail.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to edit cocktails');
    }

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
      include: INCLUDE,
    });
  }

  async remove(id: number, user: User) {
    const cocktail = await this.findOne(id);

    if (cocktail.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete cocktails');
    }

    return this.prismaService.cocktail.delete({
      where: { id },
    });
  }
}
