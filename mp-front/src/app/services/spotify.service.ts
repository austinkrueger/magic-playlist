import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

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

  getSpotifyProfile() {
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
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  invalidateToken() {
    sessionStorage.removeItem('spotifyUserInfo');
    sessionStorage.removeItem('spotifyUserId');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
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
