import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimalCreateComponent } from './animal-create/animal-create.component';

import { HomeRoutingModule } from './home/home-routing.module';
import { SyncQueueComponent } from './sync-queue/sync-queue.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: AnimalCreateComponent,
    pathMatch: 'full'
  },
  {
    path: 'queue',
    component: SyncQueueComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
