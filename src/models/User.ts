import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class User extends Model {
	public id!: string;

	public name!: string;

	public email!: string;

	public password!: string;

	public role!: string;

	public school!: string;

	public isVote!: boolean;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 5]
			}
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},

		password: {
			type: DataTypes.STRING(20),
			allowNull: false
		},

		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'user',
			validate: {
				isIn: [['admin', 'president', 'council', 'candidate', 'user']]
			}
		},

		school: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 8]
			}
		},

		isVote: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'user',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci'
	}
);

export const associate = (db: dbType): void => {
	User.hasOne(db.Pledge, { foreignKey: 'candidateId', as: 'pledge' });
	User.hasOne(db.Application, { foreignKey: 'userId', as: 'application' });
	User.hasMany(db.Evalutation, { foreignKey: 'presidentId', as: 'evaluation' });
	// eslint-disable-next-line prettier/prettier
	User.hasMany(db.PublicOpinion, { foreignKey: 'candidateId', as: 'publicOpinion' });
};

export default User;
