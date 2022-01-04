import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlogTagComponent } from './list/blog-tag.component';
import { BlogTagDetailComponent } from './detail/blog-tag-detail.component';
import { BlogTagUpdateComponent } from './update/blog-tag-update.component';
import { BlogTagDeleteDialogComponent } from './delete/blog-tag-delete-dialog.component';
import { BlogTagRoutingModule } from './route/blog-tag-routing.module';

@NgModule({
  imports: [SharedModule, BlogTagRoutingModule],
  declarations: [BlogTagComponent, BlogTagDetailComponent, BlogTagUpdateComponent, BlogTagDeleteDialogComponent],
  entryComponents: [BlogTagDeleteDialogComponent],
})
export class BlogTagModule {}
