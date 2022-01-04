import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlogEntry, getBlogEntryIdentifier } from '../blog-entry.model';

export type EntityResponseType = HttpResponse<IBlogEntry>;
export type EntityArrayResponseType = HttpResponse<IBlogEntry[]>;

@Injectable({ providedIn: 'root' })
export class BlogEntryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blog-entries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blogEntry: IBlogEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blogEntry);
    return this.http
      .post<IBlogEntry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(blogEntry: IBlogEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blogEntry);
    return this.http
      .put<IBlogEntry>(`${this.resourceUrl}/${getBlogEntryIdentifier(blogEntry) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(blogEntry: IBlogEntry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(blogEntry);
    return this.http
      .patch<IBlogEntry>(`${this.resourceUrl}/${getBlogEntryIdentifier(blogEntry) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBlogEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBlogEntry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlogEntryToCollectionIfMissing(
    blogEntryCollection: IBlogEntry[],
    ...blogEntriesToCheck: (IBlogEntry | null | undefined)[]
  ): IBlogEntry[] {
    const blogEntries: IBlogEntry[] = blogEntriesToCheck.filter(isPresent);
    if (blogEntries.length > 0) {
      const blogEntryCollectionIdentifiers = blogEntryCollection.map(blogEntryItem => getBlogEntryIdentifier(blogEntryItem)!);
      const blogEntriesToAdd = blogEntries.filter(blogEntryItem => {
        const blogEntryIdentifier = getBlogEntryIdentifier(blogEntryItem);
        if (blogEntryIdentifier == null || blogEntryCollectionIdentifiers.includes(blogEntryIdentifier)) {
          return false;
        }
        blogEntryCollectionIdentifiers.push(blogEntryIdentifier);
        return true;
      });
      return [...blogEntriesToAdd, ...blogEntryCollection];
    }
    return blogEntryCollection;
  }

  protected convertDateFromClient(blogEntry: IBlogEntry): IBlogEntry {
    return Object.assign({}, blogEntry, {
      date: blogEntry.date?.isValid() ? blogEntry.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((blogEntry: IBlogEntry) => {
        blogEntry.date = blogEntry.date ? dayjs(blogEntry.date) : undefined;
      });
    }
    return res;
  }
}
