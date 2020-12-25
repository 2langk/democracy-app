import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType } from './index';

class User extends Model {
	public id!: number;

	public name!: string;

	public email!: string;

	public password!: string;

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
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				len: [2, 8]
			}
		},
		email: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING(20),
			allowNull: false
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

export const associate = (db: dbType) => {
	// db.User.hasMany(db.Post)
};

export default User;
