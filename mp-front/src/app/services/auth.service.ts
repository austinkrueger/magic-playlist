import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SpotifyService } from './spotify.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uri = environment.backendUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private spotifyService: SpotifyService,
    private toast: ToastrService
  ) {}

  authorizeSpotifyCode(authCode: string, redirUri: string) {
    this.http
      .post(`${this.uri}/auth/request-token`, {
        code: authCode,
        redirUri: redirUri,
      })
      .subscribe(
        (response) => {
          localStorage.setItem('spotifyAccessToken', response['access_token']);
          localStorage.setItem(
            'spotifyRefreshToken',
            response['refresh_token']
          );
          if (redirUri.includes('?return_to')) {
            this.spotifyService.getSpotifyProfile(true);
          } else {
            this.spotifyService.getSpotifyProfile();
          }
        },
        (error) => {
          this.router.navigate(['']);
          this.toast.error(error, 'Oops! Something went wrong.');
        }
      );
  }

  isTokenExpired() {
    const now = Date.now();
    const jwt_expires_at = parseInt(localStorage.getItem('expires_at'), 2);
    if (now > jwt_expires_at) {
      return false;
    }

    const spotify_expires_at = parseInt(
      sessionStorage.getItem('spotifyTokenExpires'),
      2
    );

    if (now > spotify_expires_at) {
      return false;
    }

    return true;
  }

  logout() {
    this.spotifyService.invalidateTokens();
  }
}
