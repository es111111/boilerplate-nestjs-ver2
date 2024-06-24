import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from 'src/Entities/test.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class EntityDiModule {}
