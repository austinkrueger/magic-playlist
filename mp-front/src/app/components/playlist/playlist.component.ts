import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  playlist: any;
  constructor() {}

  ngOnInit(): void {
    console.log(
      JSON.parse(sessionStorage.getItem('userGeneratedTempPlaylist'))
    );
    this.playlist = JSON.parse(
      sessionStorage.getItem('userGeneratedTempPlaylist')
    );
  }

  loginSpotify() {}
}
