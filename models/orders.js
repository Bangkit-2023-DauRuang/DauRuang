module.exports = ( Sequelize, DataTypes )=> {
    const orders = Sequelize.define('orders', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          jenis_sampah: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          hargaPerKg: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          berat_sampah: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          points: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          lokasi_pengepul: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          lokasi_user: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          catatan: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          isPickedUp: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          }
        }, {
          Sequelize,
          tableName:'orders'
        });
      return orders;
}