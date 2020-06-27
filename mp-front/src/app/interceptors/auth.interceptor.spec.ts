import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PlaylistService } from '../services/playlist.service';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let service: PlaylistService;
  const userId = '1275938982';
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    })
  );
  service = TestBed.inject(PlaylistService);
  httpMock = TestBed.inject(HttpTestingController);

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    service.getPlaylistsByUser(userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`${service.uri}/playlist`);

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
  });
});
