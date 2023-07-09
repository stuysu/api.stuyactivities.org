import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
import configs from '../sequelize';
const config = configs[env];
const db = {};

let sequelize;
sequelize = new Sequelize(config.url, config);

fs.readdirSync(__dirname)
	.filter(file => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js'
		);
	})
	.forEach(file => {
		const module = require(path.resolve(__dirname, file));
		const model = module(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
