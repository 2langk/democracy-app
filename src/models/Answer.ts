import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';
import User from './User';

class Answer extends Model {
	public id?: number;

	public questionId!: string;

	public userId!: string;

	public content!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;
}

Answer.init(
	{
		questionId: {
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
		modelName: 'Answer',
		tableName: 'answer',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	Answer.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });
	Answer.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
};

export default Answer;
