import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class Pledge extends Model {
	public id!: string;

	public candidateId!: string;

	public title!: string;

	public content!: string;

	public school!: string;

	public image?: string;

	public voteCount!: number;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;
}

Pledge.init(
	{
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},

		candidateId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: true
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {}
		},

		content: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {}
		},

		school: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 8]
			}
		},

		image: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'no image'
		},

		voteCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	},
	{
		sequelize,
		modelName: 'Pledge',
		tableName: 'pledge',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	Pledge.belongsTo(db.User, { foreignKey: 'candidateId', as: 'candidate' });
};

export default Pledge;
