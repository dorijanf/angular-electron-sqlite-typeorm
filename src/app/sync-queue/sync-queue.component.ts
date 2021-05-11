import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AnimalQueue } from "../../localdb/entities/AnimalQueue";
import { SpeciesEnum } from "../../models/species-enum";
import { AnimalsService } from "../core/services/animals.service";
import { AnimalListDataSource } from "../home/animal-list-datasource";

@Component({
  selector: "app-sync-queue",
  templateUrl: "./sync-queue.component.html",
  styleUrls: ["./sync-queue.component.scss"],
})
export class SyncQueueComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AnimalQueue>;
  dataSource: AnimalListDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["name", "species", "breed", "location", "actions"];

  constructor(private router: Router, private animalsService: AnimalsService) {}

  ngOnInit(): void {
    this.initializeTable();
  }

  initializeTable(): void {
    this.animalsService.getQueue().subscribe((data) => {
      this.dataSource = new AnimalListDataSource(data);
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
}
