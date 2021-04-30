module.exports = {
	up: async (queryInterface, Sequelize) => {

		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
				primary: true
			},
			fullname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
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
		await queryInterface.dropTable('users');
	}
};
