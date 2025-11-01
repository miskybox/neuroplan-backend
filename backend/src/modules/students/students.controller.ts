import { Controller, Get, Post, Body } from '@nestjs/common';

interface StudentDto {
  id?: number;
  name: string;
  email: string;
}

// Mock temporal en memoria
const students: StudentDto[] = [];
let nextId = 1;

@Controller('students')
export class StudentsController {
  @Get()
  getAll() {
    return students;
  }

  @Post()
  create(@Body() student: StudentDto) {
    const newStudent = { ...student, id: nextId++ };
    students.push(newStudent);
    return newStudent;
  }
}
