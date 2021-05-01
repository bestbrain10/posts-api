module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('replies', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
				primary: true
			},
			reply_body: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			created_by: {
				type: Sequelize.UUID,
				allowNull: false
			},
			edited: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defautlValue: false
			},
			post_id: {
				type: Sequelize.UUID,
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
		await queryInterface.dropTable('replies');
	}
};
