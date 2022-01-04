import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlogTag } from '../blog-tag.model';
import { BlogTagService } from '../service/blog-tag.service';

@Component({
  templateUrl: './blog-tag-delete-dialog.component.html',
})
export class BlogTagDeleteDialogComponent {
  blogTag?: IBlogTag;

  constructor(protected blogTagService: BlogTagService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.blogTagService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
