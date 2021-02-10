import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class Evalutation extends Model {
	public id?: number;

	public postId!: string;

	public userId!: string;

	public school!: string;

	public rating!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;
}

Evalutation.init(
	{
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		},

		postId: {
			type: DataTypes.UUID,
			allowNull: false
		},

		school: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 8]
			}
		},

		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isIn: [['1', '2', '3', '4', '5']]
			}
		}
	},
	{
		sequelize,
		modelName: 'Evalutation',
		tableName: 'evalutation',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {};

export default Evalutation;
