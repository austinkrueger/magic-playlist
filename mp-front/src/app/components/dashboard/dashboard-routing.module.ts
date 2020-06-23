import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { PlaylistAddComponent } from '../playlist-add/playlist-add.component';

const routes: Routes = [
  {
    path: 'playlists',
    component: PlaylistListComponent,
  },
  {
    path: 'playlists/:id',
    component: PlaylistComponent,
  },
  {
    path: 'playlists/add',
    component: PlaylistAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
