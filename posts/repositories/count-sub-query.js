const { Sequelize } = require('sequelize');
module.exports = ({ table, column, foreignTable, foreignKey }) => {
	return Sequelize.literal(`CAST((SELECT COUNT("${table}"."id") FROM "${table}" WHERE "${table}"."${column}" = "${foreignTable}"."${foreignKey}") AS int)`);
};
