// import { HttpService } from '@nestjs/axios';
// import {
//   Injectable,
//   InternalServerErrorException,
//   OnModuleInit,
//   Provider,
// } from '@nestjs/common';
// import { SnakeToCamelPipe } from './snake-to-camel-pipe';

// @Injectable()
// export class CustomAxiosService extends HttpService implements OnModuleInit {
//   private readonly snakeToCamelPipe: SnakeToCamelPipe;
//   constructor() {
//     super();
//     this.snakeToCamelPipe = new SnakeToCamelPipe(); // 인스턴스 생성
//   }

//   onModuleInit() {
//     this.axiosRef.interceptors.response.use(
//       (response) => {
//         const camelCaseRes = this.snakeToCamelPipe.objectKeysToCamelCase(
//           response.data,
//         );
//         response.data = camelCaseRes;
//         return response;
//       },
//       (error) => {
//         throw new InternalServerErrorException(error.message);
//       },
//     );
//   }
// }
