import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
  ) {}

  async findByIds(ids: number[]): Promise<Variant[]> {
    return await this.variantRepo.find({
      where: {
        id: In(ids),
        product: {
          isActive: true,
        },
      },
      relations: {
        product: {
          images: true,
        },
        attributeValues: true,
      },
    });
  }
}
