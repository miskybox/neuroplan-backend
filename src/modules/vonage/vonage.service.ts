import { Injectable } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';

@Injectable()
export class VonageService {
  private vonage: Vonage;

  constructor() {
    // Inicializar Vonage SDK
    this.vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY || 'demo_key',
      apiSecret: process.env.VONAGE_API_SECRET || 'demo_secret',
    });
  }

  /**
   * Enviar SMS a padres cuando el PEI está listo
   */
  async sendSMS(to: string, message: string) {
    try {
      const result = await this.vonage.sms.send({
        to: to,
        from: 'NeuroPlan',
        text: message,
      });

      return {
        success: true,
        messageId: result.messages[0]['message-id'],
        status: result.messages[0]['status'],
      };
    } catch (error) {
      console.error('Error enviando SMS:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enviar mensaje de WhatsApp
   */
  async sendWhatsApp(to: string, templateData: { message: string }) {
    try {
      const result = await this.vonage.messages.send({
        to: to,
        from: 'whatsapp:+34600000000', // Número Vonage
        channel: 'whatsapp',
        messageType: 'text',
        text: templateData.message,
      });

      return {
        success: true,
        messageId: result.messageUUID, // Corregido: messageUUID en lugar de message_uuid
      };
    } catch (error) {
      console.error('Error enviando WhatsApp:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Crear sesión de video para tutoría
   */
  async createVideoSession(studentId: string, tutorId: string) {
    try {
      // TODO: Actualizar a la versión correcta de @vonage/video SDK
      const session = await (this.vonage.video as any).createSession({
        mediaMode: 'routed' as any,
        archiveMode: 'manual' as any,
      });

      // Generar tokens para estudiante y tutor
      const studentToken = (this.vonage.video as any).generateToken(session.sessionId, {
        role: 'publisher',
        data: `studentId=${studentId}`,
      });

      const tutorToken = (this.vonage.video as any).generateToken(session.sessionId, {
        role: 'moderator',
        data: `tutorId=${tutorId}`,
      });

      return {
        success: true,
        sessionId: session.sessionId,
        studentToken: studentToken,
        tutorToken: tutorToken,
      };
    } catch (error) {
      console.error('Error creando sesión de video:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Notificar cuando PEI está generado
   */
  async notifyPEIGenerated(studentData: any, peiUrl: string) {
    const message = `📋 PEI de ${studentData.name} está listo! 
    
Ver en: ${peiUrl}
Generado con IA el ${new Date().toLocaleDateString('es-ES')}

- NeuroPlan`;

    // Enviar SMS
    const smsResult = await this.sendSMS(studentData.parentPhone, message);

    // Si tiene WhatsApp, enviar también
    let whatsappResult = null;
    if (studentData.parentWhatsApp) {
      whatsappResult = await this.sendWhatsApp(studentData.parentWhatsApp, {
        message: message,
      });
    }

    return {
      sms: smsResult,
      whatsapp: whatsappResult,
    };
  }

  /**
   * Recordatorio de sesión
   */
  async sendSessionReminder(phone: string, sessionDate: Date, sessionLink: string) {
    const message = `🔔 Recordatorio: Sesión de orientación mañana a las ${sessionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

Unirse: ${sessionLink}

- NeuroPlan`;

    return this.sendSMS(phone, message);
  }

  /**
   * Obtener historial de mensajes
   */
  async getMessageHistory(phoneNumber: string, limit = 10) {
    // Mock data para demo
    return {
      messages: [
        {
          id: '1',
          to: phoneNumber,
          message: 'PEI de Ana Pérez está listo',
          status: 'delivered',
          timestamp: new Date(),
        },
      ],
      total: 1,
    };
  }
}
