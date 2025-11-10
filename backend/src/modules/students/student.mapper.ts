// Mapper para normalizar la salida de Student desde el esquema normalizado (persons, centers)
// Mantiene compatibilidad con el frontend actual añadiendo first_name/last_name planos

export type RawStudent = {
  id: string;
  person_id: string | null;
  center_id?: string | null;
  created_by: string;
  persons?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  centers?: {
    id: string;
    name?: string | null;
    address?: string | null;
  } | null;
  [key: string]: any;
};

export type MappedStudent = RawStudent & {
  first_name: string | null;
  last_name: string | null;
};

export function mapStudent(student: RawStudent): MappedStudent {
  return {
    ...student,
    first_name: student.persons?.first_name ?? null,
    last_name: student.persons?.last_name ?? null,
  };
}

export function mapStudents(students: RawStudent[] | null | undefined): MappedStudent[] {
  if (!students || students.length === 0) return [];
  return students.map(mapStudent);
}