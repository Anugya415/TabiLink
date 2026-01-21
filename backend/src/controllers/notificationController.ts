import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        // Count unread
        const unreadCount = await Notification.count({ where: { userId, isRead: false } });

        res.status(200).json({ success: true, data: notifications, unreadCount });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        if (id === 'all') {
            await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
        } else {
            await Notification.update({ isRead: true }, { where: { id, userId } });
        }

        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
