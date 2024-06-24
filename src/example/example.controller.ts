import { Controller, Get } from '@nestjs/common';
import { ApiDeco } from 'src/decorators/api.decorator';
import { ExampleService } from './example.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('example')
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @ApiDeco({
    operation: { summary: '테스트' },
  })
  @Get('/')
  async getAll() {
    await this.exampleService.getAll();
  }
}
