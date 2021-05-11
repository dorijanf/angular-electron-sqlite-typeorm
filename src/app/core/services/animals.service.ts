import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AppConfigService } from "./configuration/app-config.service";
import { AnimalBm } from "../../../models/animal-bm";
import { AnimalDto } from "../../../models/animal-dto";
import { ElectronService } from "./electron/electron.service";
import { Species } from "../../../localdb/entities/Species";
import { Animal } from "../../../localdb/entities/Animal";
import { AnimalLocation } from "../../../localdb/entities/AnimalLocation";
import { from } from "rxjs";
import { ConnectionService } from "./connection.service";

@Injectable({
  providedIn: "root",
})
export class AnimalsService {
  apiUrl: string;
  appUrl: string;

  /**
   * Service containing methods for animal object
   * creation, deletion, retrieval and modification.
   * @param http
   * @param config
   */
  constructor(
    private electronService: ElectronService,
    private http: HttpClient,
    private config: AppConfigService,
    private connectionService: ConnectionService
  ) {
    this.apiUrl = this.config.setting["PathAPI"];
    this.appUrl = "api/Animals/";
  }

  /**
   * Creates a new animal object and stores it in the database
   * @param model - contains animal registration information
   * @returns
   */
  createAnimal(model: AnimalBm): Promise<any> {
    // TO DO : return : Observable<any>
    return new Promise((resolve) => {
      this.connectionService.checkIfApiIsAvailable().then((response) => {
        if (response) {
          const result = this.http.post(this.apiUrl + this.appUrl, model);
          result.subscribe((x) => {
            console.log(x);
          });
          resolve(result);
          this.syncLocalData();
        } else {
          if (this.electronService.isElectron) {
            resolve(
              of(
                this.electronService.ipcRenderer.invoke(
                  "create-animal-local",
                  model
                )
              )
            );
          }
        }
      });
    });
  }

  /**
   * Gets a list of all animals for currently logged in user
   * @returns - a list of animals
   */
  getAnimals(): Promise<any> {
    // TO DO : return : Observable<AnimalDto[]>
    return new Promise((resolve) => {
      this.connectionService.checkIfApiIsAvailable().then((response) => {
        if (response) {
          const result = this.http.get<AnimalDto[]>(this.apiUrl + this.appUrl);
          const species = this.http.get<Species[]>(
            this.apiUrl + this.appUrl + "species"
          );
          this.initDatabase(result, species);
          resolve(result);
          this.syncLocalData();
        } else {
          if (this.electronService.isElectron) {
            resolve(
              from(this.electronService.ipcRenderer.invoke("get-animals-local"))
            );
          }
        }
      });
    });
  }

  getQueue(): Observable<any> {
    if (this.electronService.isElectron) {
      return from(this.electronService.ipcRenderer.invoke("get-queue"));
    }
  }

  /**
   * Gets an animal by its id
   * @param id - id of animal to be retrieved
   * @returns - animal object
   */
  getAnimal(id: number): Observable<AnimalDto> {
    return this.http.get<AnimalDto>(this.apiUrl + this.appUrl + id.toString());
  }

  /**
   * Deletes an animal by its id
   * @param id
   * @returns
   */
  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + this.appUrl + id.toString());
  }

  /**
   * Find an animal by its id and then updates it with
   * provided model object
   * @param id - id of animal to be updated
   * @param model - data to be updated
   * @returns
   */
  updateAnimal(id: number, model: AnimalBm): Observable<any> {
    return this.http.put(this.apiUrl + this.appUrl + id.toString(), model);
  }

  getAnimalSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(this.apiUrl + this.appUrl + "species");
  }

  updateAnimalLocation(model: AnimalBm): Observable<any> {
    return this.http.patch(this.apiUrl + this.appUrl, model);
  }

  /**
   * Syncs local animals by sending all animals that
   * haven't previously been synced to the API
   */
  syncLocalData(): void {
    this.electronService.ipcRenderer
      .invoke("sync-local-data")
      .then((response: AnimalBm[]) => {
        for (const animal of response) {
          this.createAnimal(animal);
        }
        console.log("Data was successfully synced");
      });
  }

  /**
   *
   * @param model - array of animalDTO retrieved from the API
   * @param species - array of species retrieved from the API
   */
  initDatabase(
    model: Observable<AnimalDto[]>,
    species: Observable<Species[]>
  ): void {
    species.subscribe((model) => {
      for (const species of model) {
        this.electronService.ipcRenderer.invoke("store-species", species);
      }
    });
    model.subscribe((model) => {
      const animalsToAdd: Animal[] = [];
      const locationsToAdd: AnimalLocation[] = [];
      for (const animal of model) {
        const animalToAdd = new Animal();
        animalToAdd.id = animal.id;
        animalToAdd.name = animal.name;
        animalToAdd.breed = animal.breed;
        animalToAdd.age = animal.age;
        animalToAdd.description = animal.description;
        animalToAdd.createdAt = animal.createdAt;
        animalToAdd.updatedAt = animal.updatedAt;
        animalToAdd.speciesId = animal.speciesId;
        animalsToAdd.push(animalToAdd);
        const locationToAdd = new AnimalLocation();
        locationToAdd.id = animal["location"].animalId;
        locationToAdd.coordX = animal["location"].coordX;
        locationToAdd.coordY = animal["location"].coordY;
        locationToAdd.animalId = animal.id;
        locationsToAdd.push(locationToAdd);
      }
      this.electronService.ipcRenderer.invoke("save-animal", animalsToAdd);

      this.electronService.ipcRenderer.invoke(
        "save-animal-location",
        locationsToAdd
      );
    });
  }
}
