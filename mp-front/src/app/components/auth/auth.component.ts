import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private _ar: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this._ar.queryParams.subscribe((res) => {
      if (!res['error']) {
        const redirUri = res['return_to']
          ? environment.redirUri + '?return_to=playlist_view'
          : environment.redirUri;
        this.authService.authorizeSpotifyCode(res['code'], redirUri);
      }
    });
  }
}
