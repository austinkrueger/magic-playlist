import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { PlaylistComponent } from '../playlist/playlist.component';
import { PlaylistAddComponent } from '../playlist-add/playlist-add.component';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { DurationParsePipe } from 'src/app/pipes/duration-parse.pipe';
import { FormsModule } from '@angular/forms';
import { PlaylistViewComponent } from '../playlist-view/playlist-view.component';

@NgModule({
  declarations: [
    PlaylistListComponent,
    PlaylistComponent,
    PlaylistAddComponent,
    TruncatePipe,
    DurationParsePipe,
    PlaylistViewComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, FormsModule],
})
export class DashboardModule {}
