import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post(`${this.uri}/api/spotify/me`, tokenInfo);
  }
}
