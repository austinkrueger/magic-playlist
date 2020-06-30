import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss'],
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  playlists: any[] = [];
  largeView = false;

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private toast: ToastrService,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    const layoutChanges = this.breakpointObserver.observe([
      '(max-width: 768px)',
      '(min-width: 769px)',
    ]);

    layoutChanges.subscribe((result) => {
      this.mediaListener(result);
    });
    // make call to playlist service to get playlists
    const listSub: Subscription = this.playlistService
      .getPlaylistsByUser(sessionStorage.getItem('spotifyUserId'))
      .subscribe(
        (response: any) => {
          this.playlists = response;
        },
        (error: any) => {
          this.toast.error(error, 'Oops! Something went wrong.');
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

  mediaListener(event) {
    this.largeView = event.breakpoints['(min-width: 769px)'] ? true : false;
  }
}
