import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userInfo: any = {};
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.getSpotifyProfile();
    this.userInfo = JSON.parse(sessionStorage.getItem('spotifyUserInfo'));
  }
}
