import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiResDataRespones } from './response-data.decorator';

// type AuthOption = {
//   roles: `${RolesCode}`[];

// };

interface IApiDeco {
  operation?: ApiOperationOptions;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  query?: ApiQueryOptions;
  //   auth?: AuthOPtion;
  response?: {
    type: Type<unknown>;
    description?: string;
    status?: number;
    isArray?: boolean;
  };
}

export function ApiDeco(option: IApiDeco) {
  const decorators = [ApiOperation(option.operation)];
  if (option.params) {
    decorators.push(...option.params.map((param) => ApiParam(param)));
  }

  if (option.body) {
    decorators.push(ApiBody(option.body));
  }

  if (option.query) {
    decorators.push(ApiQuery(option.query));
  }

  //   if (option.auth) {
  //     decorators.push(ApiBearerAuth('Authorization'));
  //     decorators.push(
  //       SetMetadata('roles', option.auth.roles),
  //       UseGuards(AuthGuard(option.auth.bz), RoleGuard),
  //     );
  //   }

  if (option.response) {
    const { type, description, status, isArray } = option.response;
    let args:
      | { description?: string | undefined; status?: number | undefined }
      | undefined;
    if (description || status) args = { description, status };

    const { ext, res } = ApiResDataRespones(type, args, isArray);
    //                   hack
    decorators.push(ext, res!);
  }
  return applyDecorators(...decorators);
}
