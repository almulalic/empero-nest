import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Cart, Customer, Order, Product, Category, Image, TokenLog, ProductImage } from '../../Models/Entities';

require('dotenv').config();

const { DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_TABLE_NAME, DB_SYNC, DB_LOGGING } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DB_TYPE as MysqlConnectionOptions['type'],
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_TABLE_NAME,
      synchronize: Boolean(Number(DB_SYNC)),
      logging: Boolean(Number(DB_LOGGING)),
      entities: [Cart, Product, Customer, Order, Image, Category, TokenLog, ProductImage],
      cli: {
        entitiesDir: 'src/Models/Entities',
        migrationsDir: 'src/Models/Migrations',
        subscribersDir: 'src/Models/Subscribers',
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
