import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit {
  playlists: any[] = [];

  constructor(
    private playlistService: PlaylistService,
    private spotifyService: SpotifyService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // make call to playlist service to get playlists
    this.playlistService
      .getPlaylistsByUser(sessionStorage.getItem('spotifyUserId'))
      .subscribe(
        (response: any) => {
          this.playlists = response;
        },
        (error: any) => {
          this.toast.error(error);
        }
      );
  }

  createNew(): void {
    this.router.navigate(['/me/playlists/add']);
  }

  viewPlaylist(playlist: any): void {
    sessionStorage.removeItem('userGeneratedTempPlaylist');
    this.router.navigate(['/me/playlists', playlist._id]);
  }

  exportPlaylist(playlist: any): void {
    this.spotifyService.exportPlaylist(playlist).subscribe(
      (response: any) => {
        playlist.url = response.externalUrl;
        this.toast.success('Playlist Successfully Exported!');
        this.playlistService.updatePlaylist(playlist).subscribe(
          (updateRes: any) => {
            // silently succeed updating the playlist url
          },
          (updateErr: any) => {
            this.toast.error(updateErr);
          }
        );
      },
      (error: any) => {
        this.toast.error(error);
      }
    );
  }
}
