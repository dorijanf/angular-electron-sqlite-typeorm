import { Sequelize } from "sequelize-typescript";
// import { Animal } from "./models/Animal";
// import { Location } from "./models/Location";
// import { Species } from "./models/Species";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  database: "animals",
  models: [__dirname + '/models'],
});
