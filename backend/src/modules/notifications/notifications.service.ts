import { Injectable, Logger } from '@nestjs/common';
import { supabase } from '../../db';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error getting user notifications', errorStack);
        return [];
      }

      return data || [];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error getting user notifications', errorStack);
      return [];
    }
  }

  async sendNotification(notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    senderId?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          sender_id: notificationData.senderId,
          read: false,
        })
        .select()
        .single();

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error sending notification', errorStack);
        throw error;
      }

      return data;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error sending notification', errorStack);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error marking notification as read', errorStack);
        throw error;
      }

      return data;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error marking notification as read', errorStack);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error marking all notifications as read', errorStack);
        throw error;
      }

      return data || [];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error marking all notifications as read', errorStack);
      throw error;
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('count', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error getting unread count', errorStack);
        return 0;
      }

      return count || 0;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error getting unread count', errorStack);
      return 0;
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error deleting notification', errorStack);
        throw error;
      }

      return { success: true };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error deleting notification', errorStack);
      throw error;
    }
  }
}