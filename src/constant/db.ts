import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(process.env.MYSQL_HOST);
export const DB = {
  DATABASE_NAME: process.env.MYSQL_DATABASE,
  TEST: 'test',
} as const;

export const options: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: DB.DATABASE_NAME,
  charset: 'utf8mb4',
};
