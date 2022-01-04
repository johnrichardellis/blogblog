import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlogEntryService } from '../service/blog-entry.service';

import { BlogEntryComponent } from './blog-entry.component';

describe('BlogEntry Management Component', () => {
  let comp: BlogEntryComponent;
  let fixture: ComponentFixture<BlogEntryComponent>;
  let service: BlogEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlogEntryComponent],
    })
      .overrideTemplate(BlogEntryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlogEntryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlogEntryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.blogEntries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
