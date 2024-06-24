import { SetMetadata } from '@nestjs/common';

export const CUSTOM_RESPOSITORY = 'CUSTOM_RESPOSITORY';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(CUSTOM_RESPOSITORY, entity);
}
