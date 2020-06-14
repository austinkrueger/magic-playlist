import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.uri}/spotify-users`);
  }

  getUserById(id) {
    return this.http.get(`${this.uri}/spotify-users/${id}`);
  }

  addUser(email, spotifyUid) {
    const user = {
      email: email,
      spotify_uid: spotifyUid,
    };
    return this.http.post(`${this.uri}/spotify-users/add`, user);
  }

  updateUser(id, email, spotifyUid) {
    const user = {
      email: email,
      spotify_uid: spotifyUid,
    };
    return this.http.post(`${this.uri}/spotify-users/update/${id}`, user);
  }

  deleteUser(id) {
    return this.http.get(`${this.uri}/spotify-users/delete/${id}`);
  }
}
