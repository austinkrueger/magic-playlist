import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { PlaylistAddComponent } from '../playlist-add/playlist-add.component';
import { FormsModule } from '@angular/forms';
import { PlaylistViewComponent } from '../playlist-view/playlist-view.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    PlaylistListComponent,
    PlaylistAddComponent,
    PlaylistViewComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, FormsModule, PipesModule],
})
export class DashboardModule {}
