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

import { Model, Column, Table, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Animal } from "./Animal";
let Location = class Location extends Model {};

__decorate([PrimaryKey, Column, __metadata("design:type", Number)], Location.prototype, "locationId", void 0);

__decorate([Column, __metadata("design:type", Number)], Location.prototype, "coordX", void 0);

__decorate([Column, __metadata("design:type", Number)], Location.prototype, "coordY", void 0);

__decorate([ForeignKey(() => Animal), Column, __metadata("design:type", Number)], Location.prototype, "animalId", void 0);

__decorate([BelongsTo(() => Animal, "animalId"), __metadata("design:type", Animal)], Location.prototype, "animal", void 0);

__decorate([CreatedAt, Column, __metadata("design:type", Date)], Location.prototype, "createdAt", void 0);

__decorate([UpdatedAt, Column, __metadata("design:type", Date)], Location.prototype, "updatedAt", void 0);

Location = __decorate([Table], Location);
export { Location };