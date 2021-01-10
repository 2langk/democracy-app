import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User } from './index';

class Comment extends Model {
	public id?: number;

	public postId!: string;

	public userId!: string;

	public content!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;
}

Comment.init(
	{
		postId: {
			allowNull: false,
			type: DataTypes.UUID
		},

		userId: {
			allowNull: false,
			type: DataTypes.UUID
		},

		content: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Comment',
		tableName: 'comment',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	Comment.belongsTo(db.Post, { foreignKey: 'postId', as: 'post' });
	Comment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};

export default Comment;
