import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlogEntry, BlogEntry } from '../blog-entry.model';
import { BlogEntryService } from '../service/blog-entry.service';

@Injectable({ providedIn: 'root' })
export class BlogEntryRoutingResolveService implements Resolve<IBlogEntry> {
  constructor(protected service: BlogEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlogEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((blogEntry: HttpResponse<BlogEntry>) => {
          if (blogEntry.body) {
            return of(blogEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BlogEntry());
  }
}
