import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, Customer, Order, Product, Category, TokenLog, Productimage } from '../../Models/Entities';

require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: process.env.DB_NAME,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TABLE_NAME,
      synchronize: Boolean(Number(process.env.DB_SYNC)),
      logging: Boolean(Number(process.env.DB_LOGGING)),
      entities: [Cart, Product, Customer, Order, Category, TokenLog, Productimage],
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
