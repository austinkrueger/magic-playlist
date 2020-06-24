import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getPlaylistsByUser(userId: string): Observable<any> {
    return this.http.get(`${this.uri}/playlist`, {
      params: { user_id: userId },
    });
  }

  getPlaylist(playlistId: string): Observable<any> {
    return this.http.get(`${this.uri}/playlist/${playlistId}`);
  }

  addPlaylist(playlist: any): Observable<any> {
    return this.http.post(`${this.uri}/playlist`, {
      playlist: playlist,
    });
  }

  updatePlaylist(playlist: any): Observable<any> {
    return this.http.put(`${this.uri}/playlist/${playlist.id}`, {
      playlist: playlist,
    });
  }

  deletePlaylist(playlistId: string): Observable<any> {
    return this.http.delete(`${this.uri}/playlist/${playlistId}`);
  }
}
