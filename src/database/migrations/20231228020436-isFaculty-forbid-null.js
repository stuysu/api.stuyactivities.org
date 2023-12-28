'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('users', 'isFaculty', {
			type: Sequelize.DataTypes.BOOLEAN, 
			allowNull: false
		});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * 
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('users', 'isFaculty', {
			type: Sequelize.DataTypes.BOOLEAN, 
			allowNull: true
		});
    
  }
};
