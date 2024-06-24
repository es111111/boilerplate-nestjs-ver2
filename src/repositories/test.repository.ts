import { CustomRepository } from 'src/decorators/custom.repository.decorator';
import { TestEntity } from 'src/Entities/test.entity';
import { Repository } from 'typeorm';

@CustomRepository(TestEntity)
export class TestRepository extends Repository<TestEntity> {}
