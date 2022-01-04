import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlogTag } from '../blog-tag.model';
import { BlogTagService } from '../service/blog-tag.service';
import { BlogTagDeleteDialogComponent } from '../delete/blog-tag-delete-dialog.component';

@Component({
  selector: 'jhi-blog-tag',
  templateUrl: './blog-tag.component.html',
})
export class BlogTagComponent implements OnInit {
  blogTags?: IBlogTag[];
  isLoading = false;

  constructor(protected blogTagService: BlogTagService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blogTagService.query().subscribe({
      next: (res: HttpResponse<IBlogTag[]>) => {
        this.isLoading = false;
        this.blogTags = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlogTag): number {
    return item.id!;
  }

  delete(blogTag: IBlogTag): void {
    const modalRef = this.modalService.open(BlogTagDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blogTag = blogTag;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
