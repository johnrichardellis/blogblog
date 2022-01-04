import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlogEntryComponent } from './list/blog-entry.component';
import { BlogEntryDetailComponent } from './detail/blog-entry-detail.component';
import { BlogEntryUpdateComponent } from './update/blog-entry-update.component';
import { BlogEntryDeleteDialogComponent } from './delete/blog-entry-delete-dialog.component';
import { BlogEntryRoutingModule } from './route/blog-entry-routing.module';

@NgModule({
  imports: [SharedModule, BlogEntryRoutingModule],
  declarations: [BlogEntryComponent, BlogEntryDetailComponent, BlogEntryUpdateComponent, BlogEntryDeleteDialogComponent],
  entryComponents: [BlogEntryDeleteDialogComponent],
})
export class BlogEntryModule {}
