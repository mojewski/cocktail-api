import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginate } from '../common/utils/paginate';
import { Role, User } from '@prisma/client';

@Injectable()
export class IngredientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createIngredientDto: CreateIngredientDto,
    user: User,
  ) {

    return this.prismaService.ingredient.create({
      data: {
        ...createIngredientDto,
        author: { connect: { id: user.id } },
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, limit, search, withAlcohol, sortBy, sortOrder } =
      paginationQuery;
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if(typeof withAlcohol === 'boolean') {
      where.withAlcohol = withAlcohol;
    }

    return paginate(
      this.prismaService.ingredient,
      {
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { id: 'asc' },
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

  async update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
    user: User,
  ) {
    const ingredient = await this.findOne(id);

    if (ingredient.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to edit this ingredient',
      );
    }

    return this.prismaService.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  async remove(id: number, user: User) {
    const ingredient = await this.findOne(id);

    if (ingredient.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to delete this ingredient',
      );
    }

    return this.prismaService.ingredient.delete({
      where: { id },
    });
  }
}
