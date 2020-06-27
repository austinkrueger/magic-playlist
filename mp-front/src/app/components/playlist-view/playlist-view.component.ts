import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify.service';

// authenticated playlist component
@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.scss'],
})
export class PlaylistViewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
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
    private spotifyService: SpotifyService,
    private toast: ToastrService,
    private ar: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    console.log('playlistid', this.ar.snapshot.paramMap.get('id'));
    const tempPlaylist = sessionStorage.getItem('userGeneratedTempPlaylist');
    if (!tempPlaylist) {
      const getSub: Subscription = this.playlistService
        .getPlaylist(this.ar.snapshot.paramMap.get('id'))
        .subscribe(
          (response: any) => {
            console.log('okay response', response);
            if (response) {
              this.playlist = response.tracks;
              this.playlistTitle = response.name;
              this.playlistDesc = response.description;
              this.playlistId = this.ar.snapshot.paramMap.get('id');
              this.playlistUrl = response.url;
            } else {
              console.log('playlist not found');
              this.toast.error('Playlist not found');
              this.router.navigate(['/me/playlists']);
            }
          },
          (error: any) => {
            this.toast.error(error);
            this.router.navigate(['/me/playlists']);
          }
        );

      this.subscriptions.push(getSub);
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
    const addSub: Subscription = this.playlistService
      .addPlaylist(newPlaylist)
      .subscribe(
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

    this.subscriptions.push(addSub);
  }

  updatePlaylist(): void {
    console.log(this.playlist);
    const updatePlaylist: any = {
      tracks: this.playlist,
      name: this.playlistTitle,
      description: this.playlistDesc,
      collaborative: false,
      public: true,
      _id: this.playlistId,
      spotify_uid: sessionStorage.getItem('spotifyUserId'),
    };
    const updateSub: Subscription = this.playlistService
      .updatePlaylist(updatePlaylist)
      .subscribe(
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

    this.subscriptions.push(updateSub);
  }

  exportPlaylist(): void {
    const postdata: any = {
      _id: this.playlistId,
      description: this.playlistDesc,
      name: this.playlistTitle,
      tracks: this.playlist,
      spotify_uid: sessionStorage.getItem('spotifyUserId'),
      collaborative: false,
      public: true,
    };
    const exportSub: Subscription = this.spotifyService
      .exportPlaylist(postdata)
      .subscribe(
        (response: any) => {
          this.playlistUrl = response.externalUrl;
          postdata['url'] = response.externalUrl;
          // this.playlist.spotify_playlist_id = response.playlistId;
          this.toast.success('Playlist Successfully Exported!');
          const updateSub = this.playlistService
            .updatePlaylist(postdata)
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

  deletePlaylist(): void {
    this.playlistService.deletePlaylist(this.playlistId).subscribe(
      (response: any) => {
        this.toast.success(response['message']);
        this.router.navigate(['/me/playlists']);
      },
      (error: any) => {
        // console.log(error);
        this.toast.error(error);
      }
    );
  }

  openInSpotify(): void {
    window.open(this.playlistUrl, '_blank');
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
