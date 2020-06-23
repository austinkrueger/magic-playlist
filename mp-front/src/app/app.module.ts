import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GenerateComponent } from './components/generate/generate.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from './pipes/truncate.pipe';
import { DurationParsePipe } from './pipes/duration-parse.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent,
    GenerateComponent,
    PlaylistListComponent,
    PlaylistComponent,
    AuthComponent,
    TruncatePipe,
    DurationParsePipe,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
