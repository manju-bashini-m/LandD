import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewIndividualComponent } from './review-individual.component';

describe('ReviewIndividualComponent', () => {
  let component: ReviewIndividualComponent;
  let fixture: ComponentFixture<ReviewIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
