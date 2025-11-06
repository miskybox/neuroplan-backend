import { HttpException, HttpStatus } from "@nestjs/common";

export class StudentNotFoundException extends HttpException {
  constructor(studentId: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Estudiante con ID ${studentId} no encontrado`,
        error: "STUDENT_NOT_FOUND",
      },
      HttpStatus.NOT_FOUND
    );
  }
}
