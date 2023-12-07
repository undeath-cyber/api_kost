"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("gambar_kost", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      gambar: {
        type: Sequelize.STRING, // You may adjust the data type according to your needs (e.g., Sequelize.TEXT, Sequelize.BLOB)
        allowNull: false,
      },
      kost_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kosts",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("gambar_kost", {
      type: "foreign key",
      fields: ["kost_id"],
      name: "fk_gambar_kost_kosts",
      references: {
        table: "kosts",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "gambar_kost",
      "fk_gambar_kost_kosts"
    );
    await queryInterface.dropTable("gambar_kost");
  },
};
