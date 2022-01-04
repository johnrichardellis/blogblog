import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlogTag, getBlogTagIdentifier } from '../blog-tag.model';

export type EntityResponseType = HttpResponse<IBlogTag>;
export type EntityArrayResponseType = HttpResponse<IBlogTag[]>;

@Injectable({ providedIn: 'root' })
export class BlogTagService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blog-tags');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blogTag: IBlogTag): Observable<EntityResponseType> {
    return this.http.post<IBlogTag>(this.resourceUrl, blogTag, { observe: 'response' });
  }

  update(blogTag: IBlogTag): Observable<EntityResponseType> {
    return this.http.put<IBlogTag>(`${this.resourceUrl}/${getBlogTagIdentifier(blogTag) as number}`, blogTag, { observe: 'response' });
  }

  partialUpdate(blogTag: IBlogTag): Observable<EntityResponseType> {
    return this.http.patch<IBlogTag>(`${this.resourceUrl}/${getBlogTagIdentifier(blogTag) as number}`, blogTag, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlogTag>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlogTag[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlogTagToCollectionIfMissing(blogTagCollection: IBlogTag[], ...blogTagsToCheck: (IBlogTag | null | undefined)[]): IBlogTag[] {
    const blogTags: IBlogTag[] = blogTagsToCheck.filter(isPresent);
    if (blogTags.length > 0) {
      const blogTagCollectionIdentifiers = blogTagCollection.map(blogTagItem => getBlogTagIdentifier(blogTagItem)!);
      const blogTagsToAdd = blogTags.filter(blogTagItem => {
        const blogTagIdentifier = getBlogTagIdentifier(blogTagItem);
        if (blogTagIdentifier == null || blogTagCollectionIdentifiers.includes(blogTagIdentifier)) {
          return false;
        }
        blogTagCollectionIdentifiers.push(blogTagIdentifier);
        return true;
      });
      return [...blogTagsToAdd, ...blogTagCollection];
    }
    return blogTagCollection;
  }
}
