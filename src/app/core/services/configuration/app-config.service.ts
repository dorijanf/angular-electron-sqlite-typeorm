import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private config: { [key: string]: string };
  constructor() {
    this.config = {
      PathAPI: "https://localhost:44355/",
    };
  }
  get setting(): { [key: string]: string } {
    return this.config;
  }

  get(key: string): string {
    return this.config[key];
  }
}
