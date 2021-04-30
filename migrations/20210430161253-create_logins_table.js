module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('logins', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
				primary: true
			},
			user: {
				type: Sequelize.UUID,
				allowNull: false
			},
			logged_out: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			logged_out_at: {
				type: 'TIMESTAMP',
			},
			created_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				allowNull: false
			},
			updated_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
				onUpdate: true,
				allowNull: false
			}
		});
	},

	// eslint-disable-next-line no-unused-vars
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('logins');
	}
};
