import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInformacionComponent } from './add-informacion.component';

describe('AddInformacionComponent', () => {
  let component: AddInformacionComponent;
  let fixture: ComponentFixture<AddInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInformacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
