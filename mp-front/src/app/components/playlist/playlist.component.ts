import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BreakpointObserver } from '@angular/cdk/layout';

// public playlist component
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlist: any;
  largeView = false;
  smallView = false;
  titleWidth = '35';
  defaultWidth = '20';
  constructor(
    private router: Router,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.playlist = JSON.parse(
      sessionStorage.getItem('userGeneratedTempPlaylist')
    );
    if (!this.playlist) {
      this.router.navigate(['']);
    }

    const layoutChanges = this.breakpointObserver.observe([
      '(max-width: 768px)',
      '(min-width: 769px)',
      '(max-width: 620px)',
    ]);

    layoutChanges.subscribe((result) => {
      this.mediaListener(result);
    });
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

  mediaListener(event) {
    this.largeView = event.breakpoints['(min-width: 769px)'] ? true : false;
    this.smallView = event.breakpoints['(max-width: 620px)'] ? true : false;
    if (this.largeView) {
      this.titleWidth = '35';
    } else if (this.smallView) {
      this.titleWidth = this.defaultWidth;
    }
  }
}
