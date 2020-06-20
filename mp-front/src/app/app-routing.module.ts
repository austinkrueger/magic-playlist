import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlaylistComponent } from './components/playlist/playlist.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'auth/spotify_login', component: AuthComponent },
  { path: 'me', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
