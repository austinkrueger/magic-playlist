import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() userInfo: any = {};
  @Input() type: string;
  @Input() includeTitle: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
}
