import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { LogoutComponent } from './components/logout/logout.component';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';

const routes: Routes = [
  {
    path: 'me',
    component: DashboardComponent,
    loadChildren: () =>
      import('./components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  { path: 'magic-playlist/:id', component: PlaylistComponent },
  { path: 'auth/spotify_login', component: AuthComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', component: LandingComponent },
  { path: '**', component: FourOhFourComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
