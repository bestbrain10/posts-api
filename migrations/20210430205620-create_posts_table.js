module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('posts', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
				primary: true
			},
			created_by: {
				type: Sequelize.UUID,
				allowNull: false
			},
			post_body: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			media: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			edited: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
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
		await queryInterface.dropTable('posts');
	}
};
