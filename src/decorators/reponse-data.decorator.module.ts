import { DynamicModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import {
  RESPONSE_DATA_METADATA,
  ResponseDataDto,
  ResponseDataOptions,
} from './response-data.decorator';

@Module({
  imports: [DiscoveryModule],
})
export class ReponseDataModule implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,

    //모든 모듈에 접근 가능한 provider Reflector
    private readonly reflector: Reflector,
  ) {}

  static forRoot(): DynamicModule {
    return {
      module: ReponseDataModule,
      global: true,
    };
  }

  onModuleInit() {}

  private getMetaData() {
    //getProviders를 통해 모든 싱글톤 instance 가져옴
    this.discovery
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        // 모든 Provider instance의 method를 순회합니다.
        this.scanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          this.mapperData(instance),
        );
      });
  }

  private mapperData(instance) {
    const { reflector } = this;
    return (methodName) => {
      const methodRef = instance[methodName];
      const metadata: ResponseDataOptions = reflector.get(
        RESPONSE_DATA_METADATA,
        methodRef,
      );
      if (!metadata) return;

      let { logger } = metadata;

      if (!logger) logger = new Logger();

      const originMethod = (...args: unknown[]) =>
        methodRef.call(instance, ...args);

      // 3. 메소드에 캐시로직을 끼워넣습니다.
      instance[methodName] = async (...args: unknown[]) => {
        // 먼저 캐시된 데이터를 가져오고

        const data = await originMethod(...args);

        return new ResponseDataDto(data, true, null);
      };
    };
  }
}
