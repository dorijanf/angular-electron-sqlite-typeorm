import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigService } from "./configuration/app-config.service";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  apiUrl: string;
  appUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.apiUrl = this.config.setting["PathAPI"];
    this.appUrl = "api/Sync/";
  }

  checkIfApiIsAvailable(): Promise<boolean> {
    return this.http
      .get(this.apiUrl + this.appUrl, { observe: "response" })
      .toPromise()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
