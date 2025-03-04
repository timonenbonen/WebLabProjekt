import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestbookShareComponent } from './guestbook-share.component';

describe('GuestbookShareComponent', () => {
  let component: GuestbookShareComponent;
  let fixture: ComponentFixture<GuestbookShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestbookShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestbookShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
