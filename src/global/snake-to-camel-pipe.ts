import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SnakeToCamelPipe implements PipeTransform {
  public snakeToCamel(s: string): string {
    if (typeof s === 'object') return this.objectKeysToCamelCase(s);
    return s.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
  }

  public objectKeysToCamelCase<T>(obj: T): T {
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.objectKeysToCamelCase(item)) as T;
      } else {
        const result: Record<string, unknown> = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = this.snakeToCamel(key);
            if (Array.isArray(obj[key])) {
              result[camelKey] = this.objectKeysToCamelCase(obj[key]);
            }
            result[camelKey] =
              obj[key] instanceof Buffer
                ? obj[key]
                : typeof obj[key] === 'object'
                ? this.objectKeysToCamelCase(
                    obj[key] as Record<string, unknown>,
                  ) // Fix: Cast obj[key] to Record<string, unknown>
                : obj[key];
          }
        }
        return result as T;
      }
    }
    return obj;
  }
  public transform(value: any, metaData: ArgumentMetadata) {
    if (value instanceof Buffer) {
      return plainToClass(metaData.metatype!, value);
    } else if (typeof value === 'object') {
      return (value = this.objectKeysToCamelCase(value));
    } else if (Array.isArray(value)) {
      return (value = this.objectKeysToCamelCase(value));
    }
    return plainToClass(metaData.metatype!, value);
  }
}
