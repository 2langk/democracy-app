import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User } from './index';

class Application extends Model {
	public id?: number;

	public userId!: string;

	public school!: string;

	public title!: string;

	public isConclude!: boolean;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;
}

Application.init(
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

		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 10]
			}
		},

		isConclude: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize,
		modelName: 'Application',
		tableName: 'application',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	Application.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};

export default Application;
