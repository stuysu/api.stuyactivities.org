'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'charters',
      'socials',
      Sequelize.DataTypes.STRING
    );
    await queryInterface.addColumn(
      'charters',
      'clubpubParticipant',
      Sequelize.DataTypes.BOOLEAN
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('charters', 'clubpubParticipant')
    await queryInterface.removeColumn('charters', 'socials')
  }
};
