import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User } from './index';

class SubComment extends Model {
	public id?: number;

	public commentId!: string;

	public userId!: string;

	public content!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;
}

SubComment.init(
	{
		commentId: {
			allowNull: false,
			type: DataTypes.INTEGER
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
		modelName: 'SubComment',
		tableName: 'subComment',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	SubComment.belongsTo(db.Comment, { foreignKey: 'commentId', as: 'comment' });
	SubComment.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};

export default SubComment;
