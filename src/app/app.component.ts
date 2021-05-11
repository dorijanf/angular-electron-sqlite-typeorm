import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AnimalsService } from './core/services/animals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private animalsService: AnimalsService
  ) {
    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      // this.animalsService.getAnimals();
      // this.animalsService.getAnimalSpecies();
    } else {
      console.log('Run in browser');
    }
  }
}
