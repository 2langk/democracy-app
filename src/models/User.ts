import * as bcrypt from 'bcryptjs';
import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { dbType, Application } from './index';

class User extends Model {
	public id!: string;

	public name!: string;

	public email!: string;

	public password?: string;

	public role!: string;

	public photo!: string;

	public school!: string;

	public schoolClass!: string;

	public isVote!: boolean;

	public isAuth!: boolean;

	public readonly createdAt!: Date;

	public readonly updatedAt!: Date;

	public application?: Application;

	public async comparePassword(password: string): Promise<boolean> {
		const isValid = await bcrypt.compare(password, this.password!);
		return isValid;
	}
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
			type: DataTypes.STRING,
			allowNull: false,
			validate: {}
		},

		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'student',
			validate: {
				isIn: [['admin', 'teacher', 'president', 'candidate', 'student']]
			}
		},

		photo: {
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

		schoolClass: {
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
		},

		isAuth: {
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
		collate: 'utf8mb4_general_ci',
		defaultScope: {
			where: { isAuth: true },
			attributes: { exclude: ['password'] }
		},
		scopes: {
			withPassword: {
				attributes: { exclude: [] }
			},
			notAuth: {
				where: { isAuth: false },
				attributes: { exclude: ['password'] }
			}
		},
		indexes: [
			{
				unique: false,
				fields: ['school']
			}
		]
	}
);

User.beforeSave(async (user: User) => {
	if (user.changed('password')) {
		// eslint-disable-next-line no-param-reassign
		user.password = await bcrypt.hash(user.password!, 12);
	}
});

export const associate = (db: dbType): void => {
	User.hasOne(db.Pledge, { foreignKey: 'candidateId', as: 'pledge' });
	User.hasOne(db.Application, { foreignKey: 'userId', as: 'application' });
	User.hasMany(db.Post, { foreignKey: 'userId', as: 'post' });
	User.hasMany(db.Comment, { foreignKey: 'userId', as: 'comment' });
	User.hasMany(db.SubComment, { foreignKey: 'userId', as: 'subComment' });
};

export default User;
