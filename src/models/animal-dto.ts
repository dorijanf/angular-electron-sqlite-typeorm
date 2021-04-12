import { LocationBm } from './location-bm';

export class AnimalDto {
  public id: number;
  public name: string;
  public breed: string;
  public age: number;
  public description: string;
  public userId: string;
  public speciesId: number;
  public location: LocationBm;
  public updatedAt: Date;
  public createdAt: Date;
}
