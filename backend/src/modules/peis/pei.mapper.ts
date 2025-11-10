// Mapper para normalizar la salida de PEI desde el esquema de base de datos
// Convierte nombres snake_case a camelCase y prepara estructura estable para el frontend

export type RawPei = {
  id: string;
  student_id?: string;
  created_by?: string;
  title?: string;
  summary?: string;
  diagnosis?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

export type MappedPei = {
  id: string;
  studentId?: string;
  createdBy?: string;
  title?: string;
  summary?: string;
  diagnosis?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Extras pasan tal cual para no perder información del MVP
  [key: string]: any;
};

export function mapPei(raw: RawPei | null | undefined): MappedPei | null {
  if (!raw) return null;
  const {
    id,
    student_id,
    created_by,
    title,
    summary,
    diagnosis,
    status,
    created_at,
    updated_at,
    ...rest
  } = raw;

  return {
    id,
    studentId: student_id,
    createdBy: created_by,
    title,
    summary,
    diagnosis,
    status,
    createdAt: created_at,
    updatedAt: updated_at,
    ...rest,
  };
}

export function mapPeis(rows: RawPei[] | null | undefined): MappedPei[] {
  if (!rows || rows.length === 0) return [];
  return rows.map(mapPei).filter(Boolean) as MappedPei[];
}