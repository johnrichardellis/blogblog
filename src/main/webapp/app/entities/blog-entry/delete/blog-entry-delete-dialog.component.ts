import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlogEntry } from '../blog-entry.model';
import { BlogEntryService } from '../service/blog-entry.service';

@Component({
  templateUrl: './blog-entry-delete-dialog.component.html',
})
export class BlogEntryDeleteDialogComponent {
  blogEntry?: IBlogEntry;

  constructor(protected blogEntryService: BlogEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blogEntryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
