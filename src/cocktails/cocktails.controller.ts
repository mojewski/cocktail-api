import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cocktails')
@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create cocktail' })
  create(@Req() req: any, @Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailsService.create(createCocktailDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.cocktailsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cocktail by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cocktailsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update cocktail' })
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailsService.update(id, updateCocktailDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete cocktail' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.cocktailsService.remove(id, req.user);
  }
}
