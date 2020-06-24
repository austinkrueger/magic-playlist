import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistListComponent } from './playlist-list.component';

describe('PlaylistListComponent', () => {
  let component: PlaylistListComponent;
  let fixture: ComponentFixture<PlaylistListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const PLAYLISTS: any[] = [
  {
    name: 'Playlist 1',
    description: 'This playlist is really cool',
    artists: [
      'Billy Joel',
      'Michael Jackson',
      'Matchbox Twenty',
      'Earl Sweatshirt',
    ],
    url: 'https://spotify.com',
    collaborative: false,
    public: true,
  },
  {
    name: 'Playlist 2',
    description: '',
    artists: ['B.B. King', 'Hoobastank', 'Disturbed', 'Frank Ocean'],
    url: 'https://spotify.com',
    collaborative: true,
    public: true,
  },
  {
    name: 'My first ever playlist!',
    description:
      'this is my first playlist I have ever made, it is so cool and awesome, enjoy!',
    artists: [
      'The White Stripes',
      'The Black Keys',
      'Blues Brothers',
      'Johnny Cash',
    ],
    url: 'https://spotify.com',
    collaborative: false,
    public: false,
  },
];
