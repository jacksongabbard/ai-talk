"use strict";
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var dotenv_1 = require("../dotenv");
var Team_1 = require("./Team");
var config = (0, dotenv_1["default"])();
var POSTGRES_HOST = config.POSTGRES_HOST, POSTGRES_DB = config.POSTGRES_DB, POSTGRES_PASSWORD = config.POSTGRES_PASSWORD, POSTGRES_PORT = config.POSTGRES_PORT, POSTGRES_USER = config.POSTGRES_USER;
var SequelizeInstance = new sequelize_typescript_1.Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
    dialect: 'postgres',
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT, 10)
});
SequelizeInstance.addModels([Team_1["default"]]);
exports["default"] = SequelizeInstance;
