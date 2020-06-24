import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uri = 'http://localhost:4000';
  constructor(
    private http: HttpClient,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  authorizeSpotifyCode(authCode: string) {
    this.http
      .post(`${this.uri}/auth/request-token`, { code: authCode })
      .subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem('spotifyAccessToken', response['access_token']);
          localStorage.setItem(
            'spotifyRefreshToken',
            response['refresh_token']
          );
          this.spotifyService.getSpotifyProfile();
        },
        (error) => {
          console.log('something bad happened');
          console.error(error);
          this.router.navigate(['']);
        }
      );
  }

  refreshToken() {}

  logout() {}
}
