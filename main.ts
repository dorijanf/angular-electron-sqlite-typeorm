/* eslint-disable @typescript-eslint/no-misused-promises */
import { app, ipcMain } from "electron";
import { BrowserWindow } from "electron";
import { screen } from "electron";
import "reflect-metadata";
import * as path from "path";
import * as url from "url";
import { createConnection } from "typeorm";
import { Animal } from "./src/localdb/entities/Animal";
import { Species } from "./src/localdb/entities/Species";
import { AnimalQueue } from "./src/localdb/entities/AnimalQueue";
import { AnimalLocation } from "./src/localdb/entities/AnimalLocation";
import { AnimalDto } from "./src/models/animal-dto";
import { AnimalBm } from "./src/models/animal-bm";

// Initialize remote module
require("@electron/remote/main").initialize();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

async function createWindow(): Promise<BrowserWindow> {
  const connection = await createConnection({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Animal, AnimalLocation, Species, AnimalQueue],
    synchronize: true,
    logging: "all",
  });

  const animalRepo = connection.getRepository(Animal);
  const locationRepo = connection.getRepository(AnimalLocation);
  const speciesRepo = connection.getRepository(Species);
  const animalQueueRepo = connection.getRepository(AnimalQueue);
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {
    win.webContents.openDevTools();

    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  ipcMain.handle("sync-local-data", async () => {
    const animals = await animalQueueRepo.find();
    const animalsToBeAdded: AnimalBm[] = [];
    for (const animal of animals) {
      if (animal.isSynced == 0) {
        animalsToBeAdded.push(<AnimalBm>{
          name: animal.name,
          breed: animal.breed,
          age: animal.age,
          description: animal.description,
          speciesId: animal.speciesId,
          coordX: animal.coordX,
          coordY: animal.coordY,
        });
      }
    }
    animalQueueRepo.clear();
    return animalsToBeAdded;
  });

  ipcMain.handle(
    "create-animal-local",
    async (_event: any, animalToAdd: AnimalBm) => {
      const animalQueue = <AnimalQueue>{
        isUpdating: 0,
        name: animalToAdd.name,
        breed: animalToAdd.breed,
        age: animalToAdd.age,
        description: animalToAdd.description,
        speciesId: animalToAdd.speciesId,
        coordX: animalToAdd.coordX,
        coordY: animalToAdd.coordY,
      };
      await animalQueueRepo.insert(animalQueue);
    }
  );

  ipcMain.handle("store-species", async (_event: any, species: Species[]) => {
    await speciesRepo.clear();
    await speciesRepo.insert(species);
  });

  // Database methods
  ipcMain.handle("save-animal", async (_event: any, animalsToAdd: Animal[]) => {
    await animalRepo.clear();
    await animalRepo.insert(animalsToAdd);
  });

  ipcMain.handle("get-queue", async () => {
    try {
      const result = await animalQueueRepo.find();
      return result;
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.handle("get-animals-local", async () => {
    const result: AnimalDto[] = [];
    try {
      const animals = await animalRepo.find();
      const locations = await locationRepo.find();
      let counter = 0;
      for (const animal of animals) {
        const animalToAdd = <AnimalDto>{
          id: animal.id,
          name: animal.name,
          description: animal.description,
          age: animal.age,
          createdAt: animal.createdAt,
          updatedAt: animal.updatedAt,
          breed: animal.breed,
          location: {
            animalId: locations[counter].animalId,
            coordX: locations[counter].coordX,
            coordY: locations[counter].coordY,
          },
          speciesId: animal.speciesId,
        };
        counter += 1;
        result.push(animalToAdd);
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.handle(
    "save-animal-location",
    async (_event: any, locations: AnimalLocation[]) => {
      await locationRepo.clear();
      await locationRepo.insert(locations);
    }
  );

  return win;
}

function initialize() {
  createWindow();
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", initialize);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
