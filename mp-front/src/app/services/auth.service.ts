import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uri = 'http://localhost:4000';
  constructor(private http: HttpClient, private router: Router) {}

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
          this.router.navigate(['me/playlists']);
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
