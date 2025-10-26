import { Injectable } from '@nestjs/common';
import { supabase } from '../../db';

@Injectable()
export class NotificationsService {
  async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error getting user notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
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
        console.error('Error sending notification:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
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
        console.error('Error marking notification as read:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        console.error('Error marking all notifications as read:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
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
        console.error('Error deleting notification:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}