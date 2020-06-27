import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  playlists: any[] = [];

  constructor(
    private playlistService: PlaylistService,
    private spotifyService: SpotifyService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    // make call to playlist service to get playlists
    const listSub: Subscription = this.playlistService
      .getPlaylistsByUser(sessionStorage.getItem('spotifyUserId'))
      .subscribe(
        (response: any) => {
          this.playlists = response;
        },
        (error: any) => {
          this.toast.error(error);
        }
      );

    this.subscriptions.push(listSub);
  }

  createNew(): void {
    this.router.navigate(['/me/playlists/add']);
  }

  viewPlaylist(playlist: any): void {
    sessionStorage.removeItem('userGeneratedTempPlaylist');
    this.router.navigate(['/me/playlists', playlist._id]);
  }

  exportPlaylist(playlist: any): void {
    const exportSub: Subscription = this.spotifyService
      .exportPlaylist(playlist)
      .subscribe(
        (response: any) => {
          playlist.url = response.externalUrl;
          this.toast.success('Playlist Successfully Exported!');
          const updateSub = this.playlistService
            .updatePlaylist(playlist)
            .subscribe(
              (updateRes: any) => {
                // silently succeed updating the playlist url
              },
              (updateErr: any) => {
                this.toast.error(updateErr);
              }
            );
          this.subscriptions.push(updateSub);
        },
        (error: any) => {
          this.toast.error(error);
        }
      );

    this.subscriptions.push(exportSub);
  }
}
