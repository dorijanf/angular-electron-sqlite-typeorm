var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

import { Model, Column, Table, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { Species } from "./Species";
let Animal = class Animal extends Model {};

__decorate([PrimaryKey, Column, __metadata("design:type", Number)], Animal.prototype, "animalId", void 0);

__decorate([Column, __metadata("design:type", String)], Animal.prototype, "name", void 0);

__decorate([Column, __metadata("design:type", String)], Animal.prototype, "breed", void 0);

__decorate([Column, __metadata("design:type", Number)], Animal.prototype, "age", void 0);

__decorate([Column, __metadata("design:type", String)], Animal.prototype, "description", void 0);

__decorate([ForeignKey(() => Species), Column, __metadata("design:type", Number)], Animal.prototype, "speciesId", void 0);

__decorate([BelongsTo(() => Species, "speciesId"), __metadata("design:type", Species)], Animal.prototype, "species", void 0);

__decorate([Column, CreatedAt, __metadata("design:type", Date)], Animal.prototype, "createdAt", void 0);

__decorate([Column, UpdatedAt, __metadata("design:type", Date)], Animal.prototype, "updatedAt", void 0);

Animal = __decorate([Table], Animal);
export { Animal };