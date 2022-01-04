import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlogEntryService } from '../service/blog-entry.service';
import { IBlogEntry, BlogEntry } from '../blog-entry.model';
import { IBlog } from 'app/entities/blog/blog.model';
import { BlogService } from 'app/entities/blog/service/blog.service';
import { IBlogTag } from 'app/entities/blog-tag/blog-tag.model';
import { BlogTagService } from 'app/entities/blog-tag/service/blog-tag.service';

import { BlogEntryUpdateComponent } from './blog-entry-update.component';

describe('BlogEntry Management Update Component', () => {
  let comp: BlogEntryUpdateComponent;
  let fixture: ComponentFixture<BlogEntryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blogEntryService: BlogEntryService;
  let blogService: BlogService;
  let blogTagService: BlogTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlogEntryUpdateComponent],
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
      .overrideTemplate(BlogEntryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlogEntryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blogEntryService = TestBed.inject(BlogEntryService);
    blogService = TestBed.inject(BlogService);
    blogTagService = TestBed.inject(BlogTagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Blog query and add missing value', () => {
      const blogEntry: IBlogEntry = { id: 456 };
      const blog: IBlog = { id: 48056 };
      blogEntry.blog = blog;

      const blogCollection: IBlog[] = [{ id: 84531 }];
      jest.spyOn(blogService, 'query').mockReturnValue(of(new HttpResponse({ body: blogCollection })));
      const additionalBlogs = [blog];
      const expectedCollection: IBlog[] = [...additionalBlogs, ...blogCollection];
      jest.spyOn(blogService, 'addBlogToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      expect(blogService.query).toHaveBeenCalled();
      expect(blogService.addBlogToCollectionIfMissing).toHaveBeenCalledWith(blogCollection, ...additionalBlogs);
      expect(comp.blogsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BlogTag query and add missing value', () => {
      const blogEntry: IBlogEntry = { id: 456 };
      const tags: IBlogTag[] = [{ id: 953 }];
      blogEntry.tags = tags;

      const blogTagCollection: IBlogTag[] = [{ id: 33757 }];
      jest.spyOn(blogTagService, 'query').mockReturnValue(of(new HttpResponse({ body: blogTagCollection })));
      const additionalBlogTags = [...tags];
      const expectedCollection: IBlogTag[] = [...additionalBlogTags, ...blogTagCollection];
      jest.spyOn(blogTagService, 'addBlogTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      expect(blogTagService.query).toHaveBeenCalled();
      expect(blogTagService.addBlogTagToCollectionIfMissing).toHaveBeenCalledWith(blogTagCollection, ...additionalBlogTags);
      expect(comp.blogTagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const blogEntry: IBlogEntry = { id: 456 };
      const blog: IBlog = { id: 42618 };
      blogEntry.blog = blog;
      const tags: IBlogTag = { id: 84803 };
      blogEntry.tags = [tags];

      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(blogEntry));
      expect(comp.blogsSharedCollection).toContain(blog);
      expect(comp.blogTagsSharedCollection).toContain(tags);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogEntry>>();
      const blogEntry = { id: 123 };
      jest.spyOn(blogEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogEntry }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(blogEntryService.update).toHaveBeenCalledWith(blogEntry);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogEntry>>();
      const blogEntry = new BlogEntry();
      jest.spyOn(blogEntryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: blogEntry }));
      saveSubject.complete();

      // THEN
      expect(blogEntryService.create).toHaveBeenCalledWith(blogEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BlogEntry>>();
      const blogEntry = { id: 123 };
      jest.spyOn(blogEntryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blogEntry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blogEntryService.update).toHaveBeenCalledWith(blogEntry);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBlogById', () => {
      it('Should return tracked Blog primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBlogById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBlogTagById', () => {
      it('Should return tracked BlogTag primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBlogTagById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedBlogTag', () => {
      it('Should return option if no BlogTag is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedBlogTag(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected BlogTag for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedBlogTag(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this BlogTag is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedBlogTag(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
