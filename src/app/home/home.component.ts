import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MatTable } from "@angular/material/table";
import { AnimalDto } from "../../models/animal-dto";
import { AnimalListDataSource } from "./animal-list-datasource";
import { SpeciesEnum } from "../../models/species-enum";
import { AnimalsService } from "../core/services/animals.service";
import { initDatabaseData } from "../core/localdb/data-access";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AnimalDto>;
  dataSource: AnimalListDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["id", "name", "species", "breed", "location", "actions"];

  constructor(private router: Router, private animalsService: AnimalsService) {}

  ngOnInit(): void {
    this.initializeTable();
  }

  initializeTable(): void {
    this.animalsService.getAnimals().subscribe((x) => {
      //initDatabaseData(x);
      this.dataSource = new AnimalListDataSource(x);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  ngAfterViewInit(): void {}

  public convertToName(id: number): any {
    for (const enumMember in SpeciesEnum) {
      if (parseInt(enumMember) === id) {
        return SpeciesEnum[id];
      }
    }
  }

  // openDialog(id: number): void {
  //   const dialogRef = this.dialog.open(AnimalDeleteComponent, {
  //     width: "300px",
  //     data: { id: id },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.initializeTable();
  //   });
  // }
}
