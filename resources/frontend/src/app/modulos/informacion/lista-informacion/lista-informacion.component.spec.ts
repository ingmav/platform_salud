import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInformacionComponent } from './lista-informacion.component';

describe('ListaInformacionComponent', () => {
  let component: ListaInformacionComponent;
  let fixture: ComponentFixture<ListaInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInformacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
