import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User } from './index';

class EduPost extends Model {
	public id!: string;

	public userId!: string;

	public title!: string;

	public video!: string;

	public content!: string;

	public school!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;
}

EduPost.init(
	{
		userId: {
			allowNull: false,
			type: DataTypes.UUID
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false
		},

		video: {
			type: DataTypes.STRING,
			allowNull: true
		},

		content: {
			type: DataTypes.STRING,
			allowNull: false
		},

		school: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 8]
			}
		}
	},
	{
		sequelize,
		modelName: 'EduPost',
		tableName: 'eduPost',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	EduPost.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};

export default EduPost;
