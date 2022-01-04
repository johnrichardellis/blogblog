import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlogTag, BlogTag } from '../blog-tag.model';
import { BlogTagService } from '../service/blog-tag.service';

@Injectable({ providedIn: 'root' })
export class BlogTagRoutingResolveService implements Resolve<IBlogTag> {
  constructor(protected service: BlogTagService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlogTag> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blogTag: HttpResponse<BlogTag>) => {
          if (blogTag.body) {
            return of(blogTag.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlogTag());
  }
}
