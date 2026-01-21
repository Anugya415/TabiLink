import { Request, Response, NextFunction } from 'express';
import SavedSearch from '../models/SavedSearch';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const createSavedSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { name, criteria } = req.body; // criteria should be a JSON object or string

        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const savedSearch = await SavedSearch.create({
            userId: authReq.user.id,
            name,
            criteria: typeof criteria === 'string' ? criteria : JSON.stringify(criteria),
        });

        res.status(201).json({
            success: true,
            data: savedSearch,
        });
    } catch (error) {
        next(error);
    }
};

export const getSavedSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const searches = await SavedSearch.findAll({
            where: { userId: authReq.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            count: searches.length,
            data: searches,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSavedSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const { id } = req.params;

        if (!authReq.user) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        const search = await SavedSearch.findOne({
            where: { id, userId: authReq.user.id },
        });

        if (!search) {
            res.status(404).json({ success: false, message: 'Saved search not found' });
            return;
        }

        await search.destroy();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
