import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blog',
        data: { pageTitle: 'blogBlogApp.blog.home.title' },
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'blog-entry',
        data: { pageTitle: 'blogBlogApp.blogEntry.home.title' },
        loadChildren: () => import('./blog-entry/blog-entry.module').then(m => m.BlogEntryModule),
      },
      {
        path: 'blog-tag',
        data: { pageTitle: 'blogBlogApp.blogTag.home.title' },
        loadChildren: () => import('./blog-tag/blog-tag.module').then(m => m.BlogTagModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
