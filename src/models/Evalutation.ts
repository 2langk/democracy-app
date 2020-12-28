import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class Evalutation extends Model {
	public id!: number;

	public userId!: string;

	public school!: string;

	public rating!: number;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;
}

Evalutation.init(
	{
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true
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
				max: 10,
				min: 1
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

export const associate = (db: dbType) => {
	// eslint-disable-next-line prettier/prettier
  Evalutation.belongsTo(db.User, { foreignKey: 'presidentId', as: 'president' })
};

export default Evalutation;
