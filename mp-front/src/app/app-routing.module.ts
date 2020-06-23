import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';

const routes: Routes = [
  {
    path: 'me',
    component: DashboardComponent,
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  { path: 'auth/spotify_login', component: AuthComponent },
  { path: '', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
