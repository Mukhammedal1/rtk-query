import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://newAdmin:newPassword777@newcluster.nfitn.mongodb.net/products?retryWrites=true&w=majority&appName=newCluster`,
    ),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
