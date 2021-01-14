import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User, Comment } from './index';

class Post extends Model {
	public id!: string;

	public userId!: string;

	public category!: string;

	public title!: string;

	public content!: string;

	public school!: string;

	public image?: string | string[];

	public video?: string;

	public viewCount!: number;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;

	public comment?: Comment[];

	public commentCount?: number;
}

Post.init(
	{
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},

		userId: {
			allowNull: false,
			type: DataTypes.UUID
		},

		category: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [['debate', 'edu', 'notice']]
			}
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false
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
		},

		image: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'no'
		},

		video: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'no'
		},

		viewCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	},
	{
		sequelize,
		modelName: 'Post',
		tableName: 'post',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		indexes: [
			{
				unique: false,
				fields: ['school']
			}
		]
	}
);

export const associate = (db: dbType): void => {
	Post.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
	Post.hasMany(db.Comment, { foreignKey: 'postId', as: 'comment' });
};

export default Post;
