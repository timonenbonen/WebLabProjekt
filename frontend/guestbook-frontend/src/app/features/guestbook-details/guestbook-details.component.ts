import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface SongCard {
  personalMessage: string | null;
  guestName: string;
  spotifySongName: string;
  spotifyArtists: string[];
  spotifyId: string;
  spotifyReleaseYear: number;
  guestbookId: number;
  qrCode: string;
}

interface Guestbook {
  id: number;
  name: string;
  designId: number;
  shareLink: string;
  songCards: SongCard[];
}

@Component({
  selector: 'app-guestbook-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guestbook-details.component.html',
  styleUrls: ['./guestbook-details.component.css'],
})
export class GuestbookDetailsComponent implements OnInit {
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  guestbook: Guestbook | null = null;
  fullShareLink: string = ''; // ✅ Holds the full link

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGuestbookDetails();
  }

  loadGuestbookDetails(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const guestbookId = this.route.snapshot.paramMap.get('id');
    if (!guestbookId) {
      console.error('❌ Error: guestbookId is undefined');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ guestbookDetails: Guestbook }>(
      `http://localhost:3000/user/guestbook/${guestbookId}`,
      { headers }
    ).subscribe({
      next: (response) => {

        if (response.guestbookDetails) {
          this.guestbook = response.guestbookDetails;
          this.fullShareLink = `${window.location.origin}/guestbook-share/${this.guestbook.shareLink}`;
          console.log('✅ Guestbook Details:', this.guestbook);
        } else {
          console.error('❌ Error: Guestbook not found');
        }
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      },
    });
  }

  copyShareLink(): void {
    if (!this.fullShareLink) return;

    navigator.clipboard.writeText(this.fullShareLink).then(() => {
      alert('✅ Share link copied to clipboard!');
    }).catch(err => {
      console.error('❌ Failed to copy:', err);
    });
  }
  async exportToPDF(): Promise<void> {
    if (!this.guestbook) return;

    const doc = new jsPDF({
      format: 'a4',
      orientation: 'portrait'
    });

    const songCardElements = document.querySelectorAll('.song-card'); // Get all song card elements
    const cardWidth = 85;  // ~13cm
    const cardHeight = 42; // ~6.5cm
    let x = 10;
    let y = 10;
    let songIndex = 0;

    for (const songCard of Array.from(songCardElements)) {
      const canvas = await html2canvas(songCard as HTMLElement, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');

      if (songIndex % 6 === 0 && songIndex !== 0) {
        doc.addPage();
        x = 10;
        y = 10;
      }

      doc.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
      y += cardHeight + 5;

      if (songIndex % 3 === 2) {
        x = 105; // Move to the next column
        y = 10;
      }
      songIndex++;
    }

    // Generate back side (QR codes)
    doc.addPage();
    x = 10;
    y = 10;
    songIndex = 0;

    for (const song of this.guestbook.songCards) {
      if (songIndex % 6 === 0 && songIndex !== 0) {
        doc.addPage();
        x = 10;
        y = 10;
      }

      if (song.qrCode) {
        doc.addImage(song.qrCode, 'PNG', x, y, cardWidth, cardHeight);
      }

      y += cardHeight + 5;
      if (songIndex % 3 === 2) {
        x = 105;
        y = 10;
      }
      songIndex++;
    }

    doc.save(`${this.guestbook.name}_guestbook.pdf`);
  }
}
