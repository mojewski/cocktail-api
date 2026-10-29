import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginate } from '../common/utils/paginate';

@Injectable()
export class IngredientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.prismaService.ingredient.create({
      data: createIngredientDto,
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const {page, limit, search, category, sortBy, sortOrder} = paginationQuery;
    const where: any = {}

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }

    return paginate(
      this.prismaService.ingredient,
      {
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
