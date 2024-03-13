import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const name = await this.categoriesRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (name) throw new BadRequestException('ten da ton tai');

    const slug = await this.categoriesRepository.findOneBy({
      slug: createCategoryDto.slug,
    });
    if (slug) throw new BadRequestException('Slug da ton tai');

    return this.categoriesRepository.save(createCategoryDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'dang ki thanh cong',
    }));
  }

  findAllForAdmin(): Promise<Category[]> {
    return this.categoriesRepository.find({});
  }

  findAllForUser(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        isActive: true,
      },
    });
  }

  async findBySlugForUser(slug: string) {
    const exist = await this.categoriesRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }
    return exist;
  }

  async findOne(id: number): Promise<Category> {
    const exist = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }

    return exist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }
    const name = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name = :nameUpdate and category.name != :nameExist', {
        nameUpdate: updateCategoryDto.name,
        nameExist: exist.name,
      })
      .getOne();

    if (name) throw new BadRequestException('ten da ton tai ');

    const slug = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.slug = :slugUpdate and category.slug != :slugExist', {
        slugUpdate: updateCategoryDto.slug,
        slugExist: exist.slug,
      })
      .getOne();
    if (slug) throw new BadRequestException('Slug da ton tai');

    return this.categoriesRepository
      .update(id, updateCategoryDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'cap nhat thanh cong',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.categoriesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }

    return this.categoriesRepository.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'xoa thanh cong',
    }));
  }
}
