import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
        this.authService.authorizeSpotifyCode(res['code']);
      }
    });
  }
}
