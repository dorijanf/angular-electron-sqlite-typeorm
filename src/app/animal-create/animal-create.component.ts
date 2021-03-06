/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AnimalDto } from "../../models/animal-dto";
import { SpeciesEnum } from "../../models/species-enum";
import { AnimalsService } from "../core/services/animals.service";

@Component({
  selector: "app-animal-create",
  templateUrl: "./animal-create.component.html",
  styleUrls: ["./animal-create.component.scss"],
})
export class AnimalCreateComponent implements OnInit {
  speciesNames: string[] = [];
  model: AnimalDto;
  title: string;
  submitText: string;
  animalCreateForm = new FormGroup({
    name: new FormControl("", Validators.required),
    breed: new FormControl(""),
    age: new FormControl(""),
    description: new FormControl("", Validators.maxLength(1024)),
    speciesId: new FormControl(""),
    coordX: new FormControl(""),
    coordY: new FormControl(""),
  });

  constructor(
    private router: Router,
    private animalsService: AnimalsService,
    private aRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSpecies();
    this.initFormOnEdit();
  }

  initFormOnEdit() : void {
    if (this.aRoute.snapshot.params["id"]) {
      this.animalsService
        .getAnimal(this.aRoute.snapshot.params["id"])
        .subscribe((x) => {
          this.title = "Edit";
          this.submitText = "Save";
          this.animalCreateForm = new FormGroup({
            name: new FormControl(x.name, Validators.required),
            breed: new FormControl(x.breed),
            age: new FormControl(x.age),
            description: new FormControl(
              x.description,
              Validators.maxLength(1024)
            ),
            speciesId: new FormControl(x.speciesId),
            coordX: new FormControl(x["location"].coordX),
            coordY: new FormControl(x["location"].coordY),
          });
        });
    } else {
      this.title = "Create";
      this.submitText = "Confirm";
    }
  }

  onSubmit() : void {
    this.animalCreateForm.value["age"] = parseInt(
      this.animalCreateForm.value["age"]
    );
    if (this.aRoute.snapshot.params["id"]) {
      this.animalCreateForm.value["speciesId"] = parseInt(
        this.animalCreateForm.value["speciesId"]
      );
      this.animalsService
        .updateAnimal(
          this.aRoute.snapshot.params["id"],
          this.animalCreateForm.value
        )
        .subscribe(
          () => {
            this.router.navigate([""]);
          },
          (error) => console.error(error)
        );
    } else {
      this.animalCreateForm.value["speciesId"] =
        parseInt(this.animalCreateForm.value["speciesId"]) + 1;
      this.animalsService.createAnimal(this.animalCreateForm.value).then(
        () => {
          this.router.navigate([""]);
        },
        (error) => console.error(error)
      );
    }
  }

  counter(i: number) : number[] {
    return new Array(i);
  }

  getSpecies() : void {
    let i = 1;
    for (const enumMember in SpeciesEnum) {
      if (SpeciesEnum[i] !== undefined) {
        this.speciesNames.push(SpeciesEnum[i]);
        i += 1;
      }
    }
  }

  get name() : any {
    return this.animalCreateForm.get("name");
  }
  get description() : any {
    return this.animalCreateForm.get("description");
  }
}
