import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgrxSignalFormsComponent } from './ngrx-signal-forms.component';

describe('NgrxSignalFormsComponent', () => {
  let component: NgrxSignalFormsComponent;
  let fixture: ComponentFixture<NgrxSignalFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgrxSignalFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgrxSignalFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
