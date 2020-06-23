import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from '../playlist/playlist.component';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { PlaylistAddComponent } from '../playlist-add/playlist-add.component';
import { PlaylistViewComponent } from '../playlist-view/playlist-view.component';

const routes: Routes = [
  {
    path: 'playlists',
    component: PlaylistListComponent,
  },
  {
    path: 'playlists/add',
    component: PlaylistAddComponent,
  },
  {
    path: 'playlists/:id',
    component: PlaylistViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
