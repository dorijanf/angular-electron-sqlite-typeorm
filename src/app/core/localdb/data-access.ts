// import * as console from "console";
import { AnimalDto } from "../../../models/animal-dto";
import { Animal } from "./models/Animal";
import { Location } from "./models/Location";
import { sequelize } from "./sequelize-config";
import { SpeciesEnum } from "../../../models/species-enum";
import { Species } from "./models/Species";

const logger = new console.Console(process.stdout, process.stderr);

export function establishConnection(): void {
  sequelize
    .authenticate()
    .then(() => {
      logger.log("Connection successfully made.");
    })
    .catch((err) => {
      logger.error("Error connecting to database", err);
    });
}

export async function startDatabase(): Promise<void> {
  try {
    await sequelize.sync({ force: true });
    getEnums();
  } catch (e) {
    logger.error(e);
  } finally {
    await sequelize.close();
  }
}

export function getEnums(): void {
  for (const species in SpeciesEnum) {
    const speciesToAdd = new Species({
      id: parseInt(species) + 1,
      name: SpeciesEnum[species],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    speciesToAdd.save();
  }
}

export async function initDatabaseData(model: AnimalDto[]): Promise<void> {
  let animalBulk: Animal[];
  let locationBulk: Location[];
  await sequelize.sync({ force: true });
  model.forEach((model) => {
    const animalToAdd = {} as Animal;
    animalToAdd.id = model.id;
    animalToAdd.name = model.name;
    animalToAdd.breed = model.breed;
    animalToAdd.age = model.age;
    animalToAdd.description = model.description;
    animalToAdd.speciesId = model.speciesId;
    animalToAdd.createdAt = model.createdAt;
    animalToAdd.updatedAt = model.updatedAt;
    animalBulk.push(animalToAdd);

    const locationToAdd = {} as Location;
    locationToAdd.coordX = model.location.coordX;
    locationToAdd.coordY = model.location.coordY;
    locationToAdd.animalId = model.id;
    locationBulk.push(locationToAdd);
  });
  try {
    await Animal.bulkCreate(animalBulk);
    await Location.bulkCreate(locationBulk);
  } catch (e) {
    logger.error(e);
  }
}
