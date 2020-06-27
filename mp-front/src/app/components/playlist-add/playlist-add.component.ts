import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-add',
  templateUrl: './playlist-add.component.html',
  styleUrls: ['./playlist-add.component.scss'],
})
export class PlaylistAddComponent implements OnInit, OnDestroy {
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
    const trackSub: Subscription = this.spotifyService
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
            const tempId =
              Math.random().toString(36).substring(2) + Date.now().toString(36);
            this.router.navigate(['me/playlists', tempId]);
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

    this.subscriptions.push(trackSub);
  }
}
