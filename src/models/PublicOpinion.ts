import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class PublicOpinion extends Model {
	public id!: number;

	public userId!: string;

	public school!: string;

	public rating!: number;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;
}

PublicOpinion.init(
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
		modelName: 'PublicOpinion',
		tableName: 'public_Opinion',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	// eslint-disable-next-line prettier/prettier
  PublicOpinion.belongsTo(db.User, { foreignKey: 'candidateId', as: 'candidate' })
  
};

export default PublicOpinion;
