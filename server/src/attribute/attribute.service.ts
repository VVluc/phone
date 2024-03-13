import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributesRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const name = await this.attributesRepository.findOneBy({
      name: createAttributeDto.name,
    });
    if (name) throw new BadRequestException('ten da ton tai ');

    return this.attributesRepository.save(createAttributeDto).then((res) => ({
      statusCode: HttpStatus.CREATED,
      message: 'dang ki thanh cong',
    }));
  }

  findAll(): Promise<Attribute[]> {
    return this.attributesRepository.find({
      relations: { attributeValues: true },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Attribute> {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay thuoc tinh');
    }

    return exist;
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay thuoc tinh');
    }
    const name = await this.attributesRepository
      .createQueryBuilder('attribute')
      .where('attribute.name = :nameUpdate and attribute.name != :nameExist', {
        nameUpdate: updateAttributeDto.name,
        nameExist: exist.name,
      })
      .getOne();
    if (name) throw new BadRequestException('ten da ton tai');

    return this.attributesRepository
      .update(id, updateAttributeDto)
      .then((res) => ({
        statusCode: HttpStatus.OK,
        message: 'cap nhat thanh cong',
      }))
      .catch((err) => console.log(err));
  }

  async remove(id: number) {
    const exist = await this.attributesRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('khong tim thay san pham');
    }

    try {
      return await this.attributesRepository.delete({ id }).then((res) => ({
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
