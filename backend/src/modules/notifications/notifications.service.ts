import { Injectable } from '@nestjs/common';
import pool from '../../db';

@Injectable()
export class NotificationsService {
  async getUserNotifications(userId: string) {
    try {
      const query = `
        SELECT 
          id,
          type,
          title,
          message,
          read,
          created_at as "createdAt"
        FROM "Notification" 
        WHERE "userId" = $1 
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async sendNotification(notificationData: {
    userIds: string[];
    type: string;
    title: string;
    message: string;
  }, senderId: string) {
    try {
      const notifications = notificationData.userIds.map(userId => ({
        userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        senderId,
        read: false,
      }));

      const values = notifications.map((_, index) => {
        const offset = index * 5;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
      }).join(', ');

      const query = `
        INSERT INTO "Notification" ("userId", type, title, message, "senderId", read)
        VALUES ${values}
        RETURNING id
      `;

      const flatValues = notifications.flatMap(n => [
        n.userId, n.type, n.title, n.message, n.senderId, n.read
      ]);

      const result = await pool.query(query, flatValues);
      return {
        success: true,
        notificationsCreated: result.rows.length,
        ids: result.rows.map(row => row.id),
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Error al enviar notificación');
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const query = `
        UPDATE "Notification" 
        SET read = true 
        WHERE id = $1 AND "userId" = $2
        RETURNING id
      `;

      const result = await pool.query(query, [notificationId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Notificación no encontrada');
      }

      return {
        success: true,
        id: result.rows[0].id,
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Error al marcar notificación como leída');
    }
  }

  async createNotification(userId: string, type: string, title: string, message: string, senderId?: string) {
    try {
      const query = `
        INSERT INTO "Notification" ("userId", type, title, message, "senderId", read)
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING id
      `;

      const result = await pool.query(query, [userId, type, title, message, senderId]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Error al crear notificación');
    }
  }
}
