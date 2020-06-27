import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
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
}
