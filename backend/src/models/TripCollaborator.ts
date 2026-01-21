import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class TripCollaborator extends Model {
    public tripId!: number;
    public userId!: number;
    public role!: 'editor' | 'viewer';
}

TripCollaborator.init(
    {
        tripId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            field: 'trip_id',
            references: {
                model: 'trips',
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id',
            },
        },
        role: {
            type: DataTypes.ENUM('editor', 'viewer'),
            allowNull: false,
            defaultValue: 'viewer',
        },
    },
    {
        sequelize,
        tableName: 'trip_collaborators',
        timestamps: false,
    }
);

export default TripCollaborator; // Ensure this is exported
