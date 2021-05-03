const { Sequelize } = require('sequelize');
const countSubQuery = require('./count-sub-query');

describe('Count Sub Query Utility', () => {
	it('returns count sub query', () => {
		const literalSpy = jest.spyOn(Sequelize, 'literal');
		const table = 'earth';
		const foreignKey = 'zid';
		const column = 'id';
		const foreignTable = 'zandor';
		countSubQuery({
			table,
			foreignKey,
			foreignTable,
			column
		});
		expect(literalSpy).toBeCalledWith(`CAST((SELECT COUNT("${table}"."id") FROM "${table}" WHERE "${table}"."${column}" = "${foreignTable}"."${foreignKey}") AS int)`);
	});
});
