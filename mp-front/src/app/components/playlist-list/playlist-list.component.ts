import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit {
  playlists: any[] = [];
  @Output() viewChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.playlists = PLAYLISTS;

    // make call to playlist service to get playlists
  }

  viewPlaylist(playlistId): void {
    this.viewChange.emit(playlistId);
  }
}

const PLAYLISTS: any[] = [
  {
    name: 'Playlist 1',
    description: 'This playlist is really cool',
    artists: [
      'Billy Joel',
      'Michael Jackson',
      'Matchbox Twenty',
      'Earl Sweatshirt',
    ],
    url: 'https://spotify.com',
    collaborative: false,
    public: true,
  },
  {
    name: 'Playlist 2',
    description: '',
    artists: ['B.B. King', 'Hoobastank', 'Disturbed', 'Frank Ocean'],
    url: 'https://spotify.com',
    collaborative: true,
    public: true,
  },
  {
    name: 'My first ever playlist!',
    description:
      'this is my first playlist I have ever made, it is so cool and awesome, enjoy!',
    artists: [
      'The White Stripes',
      'The Black Keys',
      'Blues Brothers',
      'Johnny Cash',
    ],
    url: 'https://spotify.com',
    collaborative: false,
    public: false,
  },
];
