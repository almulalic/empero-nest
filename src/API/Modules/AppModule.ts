import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './CartModule';
import {
  Cart,
  Customer,
  Order,
  Product,
  Category,
} from '../../Models/Entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: 'eu-cdbr-west-03.cleardb.net',
      port: 3306,
      username: 'b531087f31443a',
      password: 'b2283407',
      database: 'heroku_42df861642a2ede',
      synchronize: true,
      logging: false,
      entities: [Cart, Customer, Order, Product, Category],
      cli: {
        entitiesDir: 'src/Models/Entities',
        migrationsDir: 'src/Models/Migrations',
        subscribersDir: 'src/Models/Subscribers',
      },
    }),
    CartModule,
  ],
})
export class AppModule {}
