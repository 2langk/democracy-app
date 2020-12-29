import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, User, Answer } from './index';

class Question extends Model {
	public id!: string;

	public userId!: string;

	public title!: string;

	public content!: string;

	public school!: string;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public user?: User;

	public answer?: Answer[];
}

Question.init(
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
		}
	},
	{
		sequelize,
		modelName: 'Question',
		tableName: 'question',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	Question.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
	Question.hasMany(db.Answer, { foreignKey: 'questionId', as: 'answer' });
};

export default Question;
