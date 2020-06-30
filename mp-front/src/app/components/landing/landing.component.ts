import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private spotifyService: SpotifyService,
    private router: Router,
    private toast: ToastrService
  ) {}

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
            this.toast.error(error, 'Oops! Something went wrong.');
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
          const artists = response.artists;
          this.getPlaylistTracks(artists, 0);
        },
        (error) => {
          this.toast.error(error, 'Oops! Something went wrong.');
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
            sessionStorage.setItem(
              'userGeneratedTempPlaylist',
              JSON.stringify(this.trackList)
            );
            const tempId =
              Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem('tempPlaylistId', tempId);
            this.router.navigate(['magic-playlist', tempId]);
          } else {
            this.getPlaylistTracks(artistList, index + 1);
          }
        })
      )
      .subscribe(
        (response) => {
          this.trackList = this.trackList.concat(response.tracks);
        },
        (error) => {
          this.toast.error(error, 'Oops! Something went wrong.');
        }
      );
    this.subscriptions.push(trackSub);
  }
}
