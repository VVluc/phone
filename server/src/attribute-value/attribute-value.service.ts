import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './../variant/entities/variant.entity';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValuesRepository: Repository<AttributeValue>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValuesRepository
      .save(createAttributeValueDto)
      .then((res) => ({
        statusCode: HttpStatus.CREATED,
        message: 'dang ki thanh cong',
      }));
  }

  findAll() {
    return this.attributeValuesRepository.find();
  }

  async findOne(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }

    return exist;
  }

  async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }

    return this.attributeValuesRepository
      .update(id, updateAttributeValueDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'cap nhat thanh cong',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.attributeValuesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay');
    }

    const existVariants = await this.variantRepo.findBy({
      attributeValues: { id },
    });

    if (existVariants.length > 0) {
      throw new InternalServerErrorException('khong the xoa');
    }

    try {
      return await this.attributeValuesRepository
        .delete({ id })
        .then((res) => ({
          statusCode: HttpStatus.OK,
          message: 'xoa thanh cong',
        }));
    } catch (error) {
      if (error.errno === 1451) {
        throw new InternalServerErrorException('khong the xoa');
      }
      throw new InternalServerErrorException();
    }
  }
}
