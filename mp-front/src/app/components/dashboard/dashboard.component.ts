import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userInfo: any = {};
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getSpotifyProfile().subscribe(
      (response) => {
        console.log(response);
        this.userInfo = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
