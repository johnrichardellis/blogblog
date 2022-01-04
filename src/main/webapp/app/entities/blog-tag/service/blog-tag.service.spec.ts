import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlogTag, BlogTag } from '../blog-tag.model';

import { BlogTagService } from './blog-tag.service';

describe('BlogTag Service', () => {
  let service: BlogTagService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlogTag;
  let expectedResult: IBlogTag | IBlogTag[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlogTagService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BlogTag', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlogTag()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlogTag', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BlogTag', () => {
      const patchObject = Object.assign({}, new BlogTag());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlogTag', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BlogTag', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlogTagToCollectionIfMissing', () => {
      it('should add a BlogTag to an empty array', () => {
        const blogTag: IBlogTag = { id: 123 };
        expectedResult = service.addBlogTagToCollectionIfMissing([], blogTag);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogTag);
      });

      it('should not add a BlogTag to an array that contains it', () => {
        const blogTag: IBlogTag = { id: 123 };
        const blogTagCollection: IBlogTag[] = [
          {
            ...blogTag,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlogTagToCollectionIfMissing(blogTagCollection, blogTag);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlogTag to an array that doesn't contain it", () => {
        const blogTag: IBlogTag = { id: 123 };
        const blogTagCollection: IBlogTag[] = [{ id: 456 }];
        expectedResult = service.addBlogTagToCollectionIfMissing(blogTagCollection, blogTag);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogTag);
      });

      it('should add only unique BlogTag to an array', () => {
        const blogTagArray: IBlogTag[] = [{ id: 123 }, { id: 456 }, { id: 53471 }];
        const blogTagCollection: IBlogTag[] = [{ id: 123 }];
        expectedResult = service.addBlogTagToCollectionIfMissing(blogTagCollection, ...blogTagArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blogTag: IBlogTag = { id: 123 };
        const blogTag2: IBlogTag = { id: 456 };
        expectedResult = service.addBlogTagToCollectionIfMissing([], blogTag, blogTag2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogTag);
        expect(expectedResult).toContain(blogTag2);
      });

      it('should accept null and undefined values', () => {
        const blogTag: IBlogTag = { id: 123 };
        expectedResult = service.addBlogTagToCollectionIfMissing([], null, blogTag, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogTag);
      });

      it('should return initial array if no BlogTag is added', () => {
        const blogTagCollection: IBlogTag[] = [{ id: 123 }];
        expectedResult = service.addBlogTagToCollectionIfMissing(blogTagCollection, undefined, null);
        expect(expectedResult).toEqual(blogTagCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
