import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlogTagService } from '../service/blog-tag.service';
import { IBlogTag, BlogTag } from '../blog-tag.model';

import { BlogTagUpdateComponent } from './blog-tag-update.component';

describe('BlogTag Management Update Component', () => {
  let comp: BlogTagUpdateComponent;
  let fixture: ComponentFixture<BlogTagUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blogTagService: BlogTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlogTagUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BlogTagUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlogTagUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blogTagService = TestBed.inject(BlogTagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const blogTag: IBlogTag = { id: 456 };

      activatedRoute.data = of({ blogTag });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blogTag));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogTag>>();
      const blogTag = { id: 123 };
      jest.spyOn(blogTagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogTag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogTag }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blogTagService.update).toHaveBeenCalledWith(blogTag);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogTag>>();
      const blogTag = new BlogTag();
      jest.spyOn(blogTagService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogTag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogTag }));
      saveSubject.complete();

      // THEN
      expect(blogTagService.create).toHaveBeenCalledWith(blogTag);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogTag>>();
      const blogTag = { id: 123 };
      jest.spyOn(blogTagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogTag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blogTagService.update).toHaveBeenCalledWith(blogTag);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
