import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestbookDetailsComponent } from './guestbook-details.component';

describe('GuestbookDetailsComponent', () => {
  let component: GuestbookDetailsComponent;
  let fixture: ComponentFixture<GuestbookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestbookDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestbookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
