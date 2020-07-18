import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  uri = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getPlaylistsByUser(userId: string): Observable<any> {
    return this.http.post(`${this.uri}/api/playlist`, { user_id: userId });
  }

  getPlaylist(playlistId: string): Observable<any> {
    return this.http.post(`${this.uri}/api/playlist/${playlistId}`, {
      id: playlistId,
    });
  }

  addPlaylist(playlist: any): Observable<any> {
    return this.http.post(`${this.uri}/api/playlist/add`, {
      playlist: playlist,
    });
  }

  updatePlaylist(playlist: any): Observable<any> {
    return this.http.put(`${this.uri}/api/playlist/${playlist._id}`, {
      playlist: playlist,
    });
  }

  deletePlaylist(playlistId: string): Observable<any> {
    return this.http.delete(`${this.uri}/api/playlist/${playlistId}`);
  }
}
