import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'src/decorators/custom.repository.module';
import { TestRepository } from 'src/repositories/test.repository';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [CustomRepositoryModule.useCustomRepository([TestRepository])],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
