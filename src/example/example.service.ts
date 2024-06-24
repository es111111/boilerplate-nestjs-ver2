import { Injectable } from '@nestjs/common';
import { TestEntity } from 'src/Entities/test.entity';
import { TestRepository } from 'src/repositories/test.repository';

@Injectable()
export class ExampleService {
  constructor(private readonly testRepo: TestRepository) {}
  async getAll(): Promise<TestEntity[]> {
    return await this.testRepo.find();
  }
}
