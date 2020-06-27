import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private _ar: ActivatedRoute, private authService: AuthService) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    const qpSub = this._ar.queryParams.subscribe((res) => {
      if (!res['error']) {
        const redirUri = res['return_to']
          ? environment.redirUri + '?return_to=playlist_view'
          : environment.redirUri;
        this.authService.authorizeSpotifyCode(res['code'], redirUri);
      }
    });

    this.subscriptions.push(qpSub);
  }
}
