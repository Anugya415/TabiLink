import { Request, Response } from 'express';
import PriceAlert from '../models/PriceAlert';
import Hotel from '../models/Hotel';
import TravelPackage from '../models/TravelPackage';

export const createAlert = async (req: Request, res: Response) => {
    try {
        const { hotelId, travelPackageId, targetPrice, triggerType } = req.body;
        const userId = (req as any).user.id;

        // Validation
        if (!hotelId && !travelPackageId) {
            return res.status(400).json({ success: false, message: 'Must specify hotelId or travelPackageId' });
        }

        let currentPrice = 0;

        if (hotelId) {
            const hotel = await Hotel.findByPk(hotelId);
            if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
            currentPrice = hotel.price;
        } else if (travelPackageId) {
            const pkg = await TravelPackage.findByPk(travelPackageId);
            if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
            currentPrice = pkg.price;
        }

        const alert = await PriceAlert.create({
            userId,
            hotelId,
            travelPackageId,
            targetPrice,
            currentPrice,
            triggerType: triggerType || 'price_drop',
            isActive: true
        });

        res.status(201).json({ success: true, data: alert });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAlerts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const alerts = await PriceAlert.findAll({
            where: { userId, isActive: true },
            include: [{ model: Hotel, as: 'hotel' }, { model: TravelPackage, as: 'travelPackage' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: alerts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const alert = await PriceAlert.findOne({ where: { id, userId } });
        if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

        await alert.destroy(); // Hard delete or soft link? Using destroy for cleanup for now.
        res.status(200).json({ success: true, message: 'Alert deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check if a user has an alert for a specific item (for UI button state)
export const checkAlertStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { hotelId, travelPackageId } = req.query;

        const whereClause: any = { userId, isActive: true };
        if (hotelId) whereClause.hotelId = hotelId;
        if (travelPackageId) whereClause.travelPackageId = travelPackageId;

        const alert = await PriceAlert.findOne({ where: whereClause });
        res.status(200).json({ success: true, hasAlert: !!alert, alertId: alert?.id });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
