import { Injectable, NotFoundException } from '@nestjs/common';
import type { Book } from './interfaces/book.interface';
import { fakeDatabase } from '../database/fake-database';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  findAll(): Book[] {
    return fakeDatabase;
  }

  findOne(id: number): Book {
    const book = fakeDatabase.find((book) => book.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  create(createBookDto: CreateBookDto): Book {
    const newId = Math.max(...fakeDatabase.map((book) => book.id)) + 1;
    const newBook: Book = {
      id: newId,
      ...createBookDto,
    };
    fakeDatabase.push(newBook);
    return newBook;
  }

  update(id: number, updateBookDto: UpdateBookDto): Book {
    const bookIndex = fakeDatabase.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    const updatedBook = {
      ...fakeDatabase[bookIndex],
      ...updateBookDto,
    };
    ///---copy object properties
    //merge objects
    fakeDatabase[bookIndex] = updatedBook;
    return updatedBook;
  }

  remove(id: number): void {
    const bookIndex = fakeDatabase.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    fakeDatabase.splice(bookIndex, 1);
    /// splice is used for Removes items from an array.
  }
}
