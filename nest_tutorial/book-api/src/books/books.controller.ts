import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import type { Book } from './interfaces/book.interface';
///------------------
//import { BooksService } from './books.service';
///findAll()
// create()
// update()
// delete()
///---------------
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {} //This is dependency injection.
  // private Means the property belongs to this class.
  //readonly Means it cannot be reassigned later.
  @Get()
  findAll(): Book[] {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Book {
    return this.booksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto): Book {
    return this.booksService.create(createBookDto);
  }
  ///---Sends data to service to create book.
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Book {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    return this.booksService.remove(id);
  }
}
//Meaning deletion successful but no body returned.
