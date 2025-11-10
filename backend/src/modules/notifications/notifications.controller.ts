import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import {
  ResponseHelper,
  ApiResponse as ApiResponseType,
} from "../../utils/response.helper";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { NotificationsService } from "./notifications.service";
import { mapNotifications, mapNotification } from "./notification.mapper";

@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "📧 Obtener notificaciones",
    description: "Obtiene las notificaciones del usuario actual",
  })
  @SwaggerResponse({
    status: 200,
    description: "Lista de notificaciones (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          notifications: [
            {
              id: "clxxxxx",
              type: "PEI_APPROVED",
              title: "PEI Aprobado",
              message: "El PEI de María García ha sido aprobado",
              read: false,
              createdAt: "2025-10-11T15:00:00.000Z",
            },
          ],
          count: 1,
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async getNotifications(
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    const rows = await this.notificationsService.getUserNotifications(user.id);
    const notifications = mapNotifications(rows);
    return ResponseHelper.success({
      notifications,
      count: notifications.length,
    });
  }

  @Post("send")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "📤 Enviar notificación",
    description: "Envía una notificación a usuarios específicos",
  })
  @SwaggerResponse({
    status: 201,
    description: "Notificaciones enviadas correctamente (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          sent: 3,
        },
        message: "Notificaciones enviadas correctamente",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async sendNotification(
    @Body()
    notificationData: {
      userIds: string[];
      type: string;
      title: string;
      message: string;
    },
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    // El servicio acepta un userId por notificación; enviamos una por destinatario
    const results = await Promise.all(
      notificationData.userIds.map((userId) =>
        this.notificationsService.sendNotification({
          userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          senderId: user.id,
        })
      )
    );
    return ResponseHelper.created(
      { sent: results.length },
      "Notificaciones enviadas correctamente"
    );
  }

  @Post(":id/mark-read")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "✅ Marcar notificación como leída",
    description: "Marca una notificación específica como leída",
  })
  @SwaggerResponse({
    status: 200,
    description: "Notificación marcada como leída (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          id: "clxxxxx",
          read: true,
        },
        message: "Notificación marcada como leída",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async markAsRead(
    @Param("id") id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    const updated = await this.notificationsService.markAsRead(id, user.id);
    // El servicio puede devolver la fila; si viene en snake_case, mapear
    const mapped =
      updated && updated.user_id ? mapNotification(updated as any) : updated;
    return ResponseHelper.updated(
      mapped ?? { id, read: true },
      "Notificación marcada como leída"
    );
  }
}
