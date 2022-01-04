import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlogTagService } from '../service/blog-tag.service';

import { BlogTagComponent } from './blog-tag.component';

describe('BlogTag Management Component', () => {
  let comp: BlogTagComponent;
  let fixture: ComponentFixture<BlogTagComponent>;
  let service: BlogTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlogTagComponent],
    })
      .overrideTemplate(BlogTagComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlogTagComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlogTagService);

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
    expect(comp.blogTags?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
