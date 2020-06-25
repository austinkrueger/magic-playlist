import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient, private router: Router) {}

  searchArtists(searchTerm: string): Observable<any> {
    return this.http.post(`${this.uri}/api/spotify/search`, {
      search_term: searchTerm,
    });
  }

  generatePlaylistArtists(artistId: string): Observable<any> {
    return this.http.post(`${this.uri}/api/spotify/playlist/generate/artists`, {
      artist_id: artistId,
    });
  }

  generatePlaylistTracks(
    mainArtistId: string,
    artistId: string
  ): Observable<any> {
    return this.http.post(`${this.uri}/api/spotify/playlist/generate/tracks`, {
      main_artist_id: mainArtistId,
      artist_id: artistId,
    });
  }

  getSpotifyProfile(viewPlaylist?: boolean) {
    const tokenInfo = {
      token: localStorage.getItem('spotifyAccessToken'),
    };
    return this.http.post(`${this.uri}/api/spotify/me`, tokenInfo).subscribe(
      (res: any) => {
        console.log(res);
        const expiresAt = moment().add(res.expiresIn, 'second');
        sessionStorage.setItem('spotifyUserInfo', JSON.stringify(res.data));
        sessionStorage.setItem('spotifyUserId', res.data.id);
        localStorage.setItem('id_token', res.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        if (viewPlaylist) {
          this.router.navigate([
            '/me/playlists',
            sessionStorage.getItem('tempPlaylistId'),
          ]);
        } else {
          this.router.navigate(['/me/playlists']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  invalidateTokens() {
    sessionStorage.removeItem('spotifyUserInfo');
    sessionStorage.removeItem('spotifyUserId');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyRefreshToken');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
