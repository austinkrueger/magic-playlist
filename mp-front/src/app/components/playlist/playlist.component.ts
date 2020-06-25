import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// public playlist component
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlist: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(
      JSON.parse(sessionStorage.getItem('userGeneratedTempPlaylist'))
    );
    this.playlist = JSON.parse(
      sessionStorage.getItem('userGeneratedTempPlaylist')
    );
    if (!this.playlist) {
      this.router.navigate(['']);
    }
  }

  loginSpotify(): void {
    // redirect to spotify auth page
    // spoitfy api client id e2e60f39a4e44e9ba073f4594dfd4e73
    const scopes = 'user-read-private user-read-email';
    const clientId = environment.clientId;
    const redirUri = environment.redirUri + '?return_to=playlist_view';
    const uri = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scopes=${scopes}&redirect_uri=${redirUri}`;
    window.location.href = uri;
  }

  createNew(): void {
    sessionStorage.setItem('userGeneratedTempPlaylist', null);
    this.router.navigate(['']);
  }

  getArtists(track: any): string {
    let artistStr = '';
    for (let i = 0; i < track.artists.length; i++) {
      if (i > 0) {
        artistStr += ', ';
      }
      artistStr += track.artists[i].name;
    }
    return artistStr;
  }
}
