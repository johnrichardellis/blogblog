import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBlogEntry, BlogEntry } from '../blog-entry.model';

import { BlogEntryService } from './blog-entry.service';

describe('BlogEntry Service', () => {
  let service: BlogEntryService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlogEntry;
  let expectedResult: IBlogEntry | IBlogEntry[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlogEntryService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      content: 'AAAAAAA',
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BlogEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new BlogEntry()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlogEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          content: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BlogEntry', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          content: 'BBBBBB',
        },
        new BlogEntry()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlogEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          content: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BlogEntry', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlogEntryToCollectionIfMissing', () => {
      it('should add a BlogEntry to an empty array', () => {
        const blogEntry: IBlogEntry = { id: 123 };
        expectedResult = service.addBlogEntryToCollectionIfMissing([], blogEntry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogEntry);
      });

      it('should not add a BlogEntry to an array that contains it', () => {
        const blogEntry: IBlogEntry = { id: 123 };
        const blogEntryCollection: IBlogEntry[] = [
          {
            ...blogEntry,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlogEntryToCollectionIfMissing(blogEntryCollection, blogEntry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlogEntry to an array that doesn't contain it", () => {
        const blogEntry: IBlogEntry = { id: 123 };
        const blogEntryCollection: IBlogEntry[] = [{ id: 456 }];
        expectedResult = service.addBlogEntryToCollectionIfMissing(blogEntryCollection, blogEntry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogEntry);
      });

      it('should add only unique BlogEntry to an array', () => {
        const blogEntryArray: IBlogEntry[] = [{ id: 123 }, { id: 456 }, { id: 63083 }];
        const blogEntryCollection: IBlogEntry[] = [{ id: 123 }];
        expectedResult = service.addBlogEntryToCollectionIfMissing(blogEntryCollection, ...blogEntryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blogEntry: IBlogEntry = { id: 123 };
        const blogEntry2: IBlogEntry = { id: 456 };
        expectedResult = service.addBlogEntryToCollectionIfMissing([], blogEntry, blogEntry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blogEntry);
        expect(expectedResult).toContain(blogEntry2);
      });

      it('should accept null and undefined values', () => {
        const blogEntry: IBlogEntry = { id: 123 };
        expectedResult = service.addBlogEntryToCollectionIfMissing([], null, blogEntry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blogEntry);
      });

      it('should return initial array if no BlogEntry is added', () => {
        const blogEntryCollection: IBlogEntry[] = [{ id: 123 }];
        expectedResult = service.addBlogEntryToCollectionIfMissing(blogEntryCollection, undefined, null);
        expect(expectedResult).toEqual(blogEntryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
