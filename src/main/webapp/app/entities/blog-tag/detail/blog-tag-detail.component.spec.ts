import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BlogTagDetailComponent } from './blog-tag-detail.component';

describe('BlogTag Management Detail Component', () => {
  let comp: BlogTagDetailComponent;
  let fixture: ComponentFixture<BlogTagDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogTagDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ blogTag: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BlogTagDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BlogTagDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load blogTag on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.blogTag).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
