import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit {
  playlists: any[] = [];

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.playlists = PLAYLISTS;
    // make call to playlist service to get playlists
    this.playlistService
      .getPlaylistsByUser(sessionStorage.getItem('spotifyUserId'))
      .subscribe(
        (response: any) => {
          console.log(response);
          this.playlists = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  createNew() {
    this.router.navigate(['/me/playlists/add']);
  }
}
