import { Logger, SetMetadata, Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export interface ResponseDataOptions {
  logger?: Logger;
  pagination?: boolean;
  search?: boolean;
}

export interface ErrorObj {
  message: string | object;
  code: number;
}

export interface ErrorResponse {
  reqId: string;
  method: string;
  errUrl?: string;
  errors?: Errortype;
  queryParams?: object;
  bodyParams?: object;
}
export type Errortype = [ErrorObj] | [];

export class ResponseDataDto<T> {
  data: T;
  @ApiProperty({
    description: '응답성공여부',
  })
  isSuccess: boolean;

  @ApiProperty({
    description: '응답 에러',
  })
  error: ErrorResponse | null;

  constructor(data: T, success: boolean, error: ErrorResponse | null = null) {
    this.data = this.camelToSnake(data);
    this.isSuccess = success;
    this.error = error;
  }

  private getValue<T>(value: T) {
    if (value instanceof Date || value instanceof Buffer) {
      return value instanceof Buffer ? !!value.readInt8(0) : value;
    }

    return typeof value === 'object' ? this.camelToSnake(value) : value;
  }

  private convert(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  private camelToSnake<K>(obj: K): K {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.camelToSnake(item)) as K;
    }

    return Object.keys(obj).reduce((acc, key) => {
      const snakeCaseKey = this.convert(key);
      const value = obj[key as keyof K];

      acc[snakeCaseKey as string] = this.getValue(value);
      return acc;
    }, {} as Record<string, unknown>) as K;
  }
}

export const RESPONSE_DATA_METADATA = 'RESPONSE_DATA_METADATA';

//데코레이터 함수 정의
export function ResponseData(
  options: ResponseDataOptions = {},
): MethodDecorator {
  return applyDecorators(SetMetadata(RESPONSE_DATA_METADATA, options));
}

type ResponseArgs = {
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  body: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<'send', <T>(d: T) => T>;
} & Record<
  Exclude<string, 'query' | 'params' | 'body' | 'header' | 'response'>,
  Record<string, unknown>
>;

//Swagger용
export const ApiResDataRespones = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  args?: {
    description?: string;
    status?: number;
  },
  isArray: boolean | null = false,
) => {
  const { status, description } = args || { status: 200, description: 'OK' };
  const properties = {
    data: isArray
      ? {
          description,
          items: { $ref: getSchemaPath(dataDto) },
        }
      : { $ref: getSchemaPath(dataDto) },
  };
  const responseDeco = function () {
    switch (status) {
      case 200:
        return ApiOkResponse({
          schema: {
            type: 'object',
            format: 'object',
            allOf: [
              { $ref: getSchemaPath(ResponseDataDto<typeof dataDto>) },
              {
                properties,
              },
            ],
          },
        });
      case 201:
        return ApiCreatedResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(ResponseDataDto<typeof dataDto>) },
              {
                properties,
              },
            ],
          },
        });
    }
  };

  return {
    ext: ApiExtraModels(ResponseDataDto<typeof dataDto>, dataDto),
    res: responseDeco(),
  };
};
