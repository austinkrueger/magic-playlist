import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() userInfo: any = {};
  @Input() type: string;
  @Input() includeTitle: boolean;
  largeView = false;

  constructor(
    private router: Router,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const layoutChanges = this.breakpointObserver.observe([
      '(max-width: 768px)',
      '(min-width: 769px)',
    ]);

    layoutChanges.subscribe((result) => {
      this.mediaListener(result);
    });
  }

  loginSpotify(): void {
    // redirect to spotify auth page
    // spoitfy api client id e2e60f39a4e44e9ba073f4594dfd4e73
    const scopes =
      'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const clientId = environment.clientId;
    const redirUri = environment.redirUri;
    const uri = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirUri}`;
    window.location.href = uri;
  }

  logout(): void {
    this.router.navigate(['/logout']);
  }

  mediaListener(event) {
    this.largeView = event.breakpoints['(min-width: 769px)'] ? true : false;
  }
}
