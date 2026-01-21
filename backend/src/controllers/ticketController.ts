import { Request, Response, NextFunction } from 'express';
import Ticket from '../models/Ticket';

// Define custom request interface if not global (assuming it might be extended globally, but to be safe)
interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { subject, description, priority } = req.body;

        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const ticket = await Ticket.create({
            userId: authReq.user.id,
            subject,
            description,
            priority: priority || 'medium',
            status: 'open',
        });

        res.status(201).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
};

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const tickets = await Ticket.findAll({
            where: { userId: authReq.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        next(error);
    }
};

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;

        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const ticket = await Ticket.findOne({
            where: { id, userId: authReq.user.id },
        });

        if (!ticket) {
            res.status(404).json({ success: false, message: 'Ticket not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;
        const { status, description } = req.body; // Allow updating description? Maybe not. Usually just status or add comment.

        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const ticket = await Ticket.findOne({
            where: { id, userId: authReq.user.id },
        });

        if (!ticket) {
            res.status(404).json({ success: false, message: 'Ticket not found' });
            return;
        }

        // Only allow user to close ticket or maybe re-open?
        if (status) {
            ticket.status = status;
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        next(error);
    }
};
