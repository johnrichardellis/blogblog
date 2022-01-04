import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlogEntryComponent } from '../list/blog-entry.component';
import { BlogEntryDetailComponent } from '../detail/blog-entry-detail.component';
import { BlogEntryUpdateComponent } from '../update/blog-entry-update.component';
import { BlogEntryRoutingResolveService } from './blog-entry-routing-resolve.service';

const blogEntryRoute: Routes = [
  {
    path: '',
    component: BlogEntryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlogEntryDetailComponent,
    resolve: {
      blogEntry: BlogEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlogEntryUpdateComponent,
    resolve: {
      blogEntry: BlogEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlogEntryUpdateComponent,
    resolve: {
      blogEntry: BlogEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blogEntryRoute)],
  exports: [RouterModule],
})
export class BlogEntryRoutingModule {}
