import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
///-----root modules
@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
