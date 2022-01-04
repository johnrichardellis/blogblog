import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BlogTagComponent } from '../list/blog-tag.component';
import { BlogTagDetailComponent } from '../detail/blog-tag-detail.component';
import { BlogTagUpdateComponent } from '../update/blog-tag-update.component';
import { BlogTagRoutingResolveService } from './blog-tag-routing-resolve.service';

const blogTagRoute: Routes = [
  {
    path: '',
    component: BlogTagComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BlogTagDetailComponent,
    resolve: {
      blogTag: BlogTagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BlogTagUpdateComponent,
    resolve: {
      blogTag: BlogTagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BlogTagUpdateComponent,
    resolve: {
      blogTag: BlogTagRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(blogTagRoute)],
  exports: [RouterModule],
})
export class BlogTagRoutingModule {}
