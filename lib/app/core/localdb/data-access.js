var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

import { Animal } from "./models/Animal";
import { Location } from "./models/Location";
import { sequelize } from "./sequelize-config";
import { SpeciesEnum } from "../../../models/species-enum";
import { Species } from "./models/Species";
const logger = new console.Console(process.stdout, process.stderr);
export function establishConnection() {
  sequelize.authenticate().then(() => {
    logger.log("Connection successfully made.");
  }).catch(err => {
    logger.error("Error connecting to database", err);
  });
}
export function startDatabase() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      yield sequelize.sync({
        force: true
      });
      getEnums();
    } catch (e) {
      logger.error(e);
    } finally {
      yield sequelize.close();
    }
  });
}
export function getEnums() {
  for (const species in SpeciesEnum) {
    const speciesToAdd = new Species({
      id: parseInt(species) + 1,
      name: SpeciesEnum[species],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    speciesToAdd.save();
  }
}
export function initDatabaseData(model) {
  return __awaiter(this, void 0, void 0, function* () {
    let animalBulk;
    let locationBulk;
    yield sequelize.sync({
      force: true
    });
    model.forEach(model => {
      const animalToAdd = {};
      animalToAdd.id = model.id;
      animalToAdd.name = model.name;
      animalToAdd.breed = model.breed;
      animalToAdd.age = model.age;
      animalToAdd.description = model.description;
      animalToAdd.speciesId = model.speciesId;
      animalToAdd.createdAt = model.createdAt;
      animalToAdd.updatedAt = model.updatedAt;
      animalBulk.push(animalToAdd);
      const locationToAdd = {};
      locationToAdd.coordX = model.location.coordX;
      locationToAdd.coordY = model.location.coordY;
      locationToAdd.animalId = model.id;
      locationBulk.push(locationToAdd);
    });

    try {
      yield Animal.bulkCreate(animalBulk);
      yield Location.bulkCreate(locationBulk);
    } catch (e) {
      logger.error(e);
    }
  });
}