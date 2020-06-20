import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  searchTerm = '';
  searchResults: any[] = [];
  showLoader = false;
  mainArtistId = '';
  trackList: any[] = [];

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loginSpotify(): void {
    // redirect to spotify auth page
    // spoitfy api client id e2e60f39a4e44e9ba073f4594dfd4e73
    const scopes = 'user-read-private user-read-email';
    const clientId = environment.clientId;
    const redirUri = environment.redirUri;
    const uri = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scopes=${scopes}&redirect_uri=${redirUri}`;
    window.location.href = uri;
  }

  search(): void {
    if (this.searchTerm) {
      const searchSub: Subscription = this.spotifyService
        .searchArtists(this.searchTerm)
        .subscribe(
          (response): any => {
            this.searchResults = response['artists']
              ? response['artists']['items']
              : [];
          },
          (error): any => {
            console.log(error);
          }
        );
      this.subscriptions.push(searchSub);
    }
  }

  createPlaylist(artist: any): void {
    this.showLoader = true;
    this.searchTerm = '';
    this.searchResults = [];
    this.mainArtistId = artist.id;
    const genSub: Subscription = this.spotifyService
      .generatePlaylistArtists(artist.id)
      .subscribe(
        (response): any => {
          console.log(response);
          const artists = response.artists;
          this.getPlaylistTracks(artists, 0);
        },
        (error) => {
          console.log(error);
        }
      );
    this.subscriptions.push(genSub);
  }

  getPlaylistTracks(artistList, index) {
    this.spotifyService
      .generatePlaylistTracks(this.mainArtistId, artistList[index])
      .pipe(
        finalize(() => {
          if (index === artistList.length - 1) {
            this.showLoader = false;
            console.log('show me the list now that we are done');
            console.log(this.trackList);
            console.log('done');
            sessionStorage.setItem(
              'userGeneratedTempPlaylist',
              JSON.stringify(this.trackList)
            );
            this.router.navigate(['playlist']);
          } else {
            this.getPlaylistTracks(artistList, index + 1);
          }
        })
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.trackList = this.trackList.concat(response.tracks);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
