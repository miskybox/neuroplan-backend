// Mapper para normalizar la salida de Notification desde el esquema de base de datos
// Convierte snake_case a camelCase y preserva campos adicionales

export type RawNotification = {
  id: string;
  user_id: string;
  sender_id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at?: string;
  [key: string]: any;
};

export type MappedNotification = {
  id: string;
  userId: string;
  senderId?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
  [key: string]: any;
};

export function mapNotification(raw: RawNotification | null | undefined): MappedNotification | null {
  if (!raw) return null;
  const { id, user_id, sender_id, type, title, message, read, created_at, ...rest } = raw;
  return {
    id,
    userId: user_id,
    senderId: sender_id,
    type,
    title,
    message,
    read,
    createdAt: created_at,
    ...rest,
  };
}

export function mapNotifications(rows: RawNotification[] | null | undefined): MappedNotification[] {
  if (!rows || rows.length === 0) return [];
  return rows.map(mapNotification).filter(Boolean) as MappedNotification[];
}