import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ToastrService } from 'ngx-toastr';

// authenticated playlist component
@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss'],
})
export class PlaylistViewComponent implements OnInit {
  playlist: any;
  playlistTitle = 'New Playlist';
  playlistDesc = 'Enter a description for your playlist!';
  editingTitle = false;
  editingDesc = false;
  playlistId;
  playlistUrl;

  @ViewChild('title') title: ElementRef<any>;
  @ViewChild('desc') desc: ElementRef<any>;
  constructor(
    private router: Router,
    private playlistService: PlaylistService,
    private toast: ToastrService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('playlistid', this.ar.snapshot.paramMap.get('id'));
    const tempPlaylist = sessionStorage.getItem('userGeneratedTempPlaylist');
    if (!tempPlaylist) {
      this.playlistService
        .getPlaylist(this.ar.snapshot.paramMap.get('id'))
        .subscribe(
          (response: any) => {
            console.log('okay response', response);
            this.playlist = response.tracks;
            this.playlistTitle = response.name;
            this.playlistDesc = response.description;
            this.playlistId = this.ar.snapshot.paramMap.get('id');
            this.playlistUrl = response.url;
          },
          (error: any) => {
            this.toast.error(error);
            this.router.navigate(['/me/playlists']);
          }
        );
    } else {
      this.playlist = JSON.parse(tempPlaylist);
      if (!this.playlist) {
        this.router.navigate(['/me/playlists']);
      }
    }
  }

  createNew(): void {
    sessionStorage.setItem('userGeneratedTempPlaylist', null);
    this.router.navigate(['/me/playlists/add']);
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

  savePlaylist(): void {
    console.log(this.playlist);
    const newPlaylist: any = {
      tracks: this.playlist,
      name: this.playlistTitle,
      description: this.playlistDesc,
      collaborative: false,
      public: true,
      spotify_uid: sessionStorage.getItem('spotifyUserId'),
    };
    this.playlistService.addPlaylist(newPlaylist).subscribe(
      (response: any) => {
        if (response['playlist']) {
          this.toast.success(response['playlist']);
          this.router.navigate(['/me/playlists']);
        }
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error);
      }
    );
  }

  updatePlaylist(): void {
    console.log(this.playlist);
    const updatePlaylist: any = {
      tracks: this.playlist,
      name: this.playlistTitle,
      description: this.playlistDesc,
      collaborative: false,
      public: true,
      id: this.playlistId,
      spotify_uid: sessionStorage.getItem('spotifyUserId'),
    };
    this.playlistService.updatePlaylist(updatePlaylist).subscribe(
      (response: any) => {
        if (response['playlist']) {
          this.toast.success(response['message']);
        }
      },
      (error: any) => {
        console.log(error);
        this.toast.error(error);
      }
    );
  }

  exportPlaylist(): void {}

  openInSpotify(): void {
    window.location.href = this.playlistUrl;
  }

  editTitle(): void {
    this.editingTitle = true;
    setTimeout(() => {
      this.title.nativeElement.focus();
    }, 0);
  }

  editDesc(): void {
    this.editingDesc = true;
    setTimeout(() => {
      this.desc.nativeElement.focus();
    }, 0);
  }
}
