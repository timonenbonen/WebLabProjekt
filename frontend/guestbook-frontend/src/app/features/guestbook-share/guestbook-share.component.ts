import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Song {
  spotifyId: string;
  name: string;
  artist: string[];  // ✅ Ensure "artist" is an array
  releaseYear: string;
}

@Component({
  selector: 'app-guestbook-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guestbook-share.component.html',
  styleUrls: ['./guestbook-share.component.css'],
})
export class GuestbookShareComponent implements OnInit {
  guestbook: { id: number; name: string; designId: number; shareLink: string } | null = null;
  shareLink: string | null = null;
  guestName: string = '';
  searchQuery: string = '';
  searchResults: Song[] = [];
  selectedSong: Song | null = null;
  personalMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.shareLink = this.route.snapshot.paramMap.get('shareLink');
    if (this.shareLink) {
      this.fetchGuestbookByShareLink();
    }
  }

  fetchGuestbookByShareLink(): void {
    this.http.get<{ id: number; name: string; designId: number; shareLink: string }>(
      `http://localhost:3000/guestbook/by-share-link/${this.shareLink}`
    ).subscribe({
      next: (response) => {
        this.guestbook = response;
      },
      error: (err) => {
        console.error('❌ Failed to fetch guestbook:', err);
      },
    });
  }

  searchSongs(): void {
    if (!this.searchQuery.trim()) return;

    this.http.get<Song[]>(`http://localhost:3000/guestbook/search?query=${encodeURIComponent(this.searchQuery)}`)
      .subscribe({
        next: (results) => {
          console.log('✅ Search results:', results);
          this.searchResults = results;
        },
        error: (err) => {
          console.error('❌ Search failed:', err);
        },
      });
  }

  selectSong(song: Song): void {
    this.selectedSong = song;
  }

  addSong(): void {
    if (!this.guestbook || !this.selectedSong || !this.guestName.trim()) {
      alert('❌ Please enter your name and select a song.');
      return;
    }

    const formData = new FormData();
    formData.append('guestName', this.guestName);
    formData.append('spotifySongId', this.selectedSong.spotifyId);
    formData.append('guestbookId', this.guestbook.id.toString());
    if (this.personalMessage) {
      formData.append('personalMessage', this.personalMessage.trim().toString());
    }

    const guestName = this.guestName
    const spotifySongId = this.selectedSong.spotifyId;
    const guestbookId = this.guestbook.id.toString();
    const personalMessage = this.personalMessage ? this.personalMessage : '';

    this.http.post(`http://localhost:3000/guestbook/add`, { guestName, spotifySongId, guestbookId, personalMessage }).subscribe({
      next: () => {
        alert('✅ Song added successfully!');
        this.searchQuery = '';
        this.searchResults = [];
        this.selectedSong = null;
        this.personalMessage = '';
      },
      error: (err) => {
        console.error('❌ Failed to add song:', err);
      },
    });
  }
}
