import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBlogEntry } from '../blog-entry.model';
import { BlogEntryService } from '../service/blog-entry.service';
import { BlogEntryDeleteDialogComponent } from '../delete/blog-entry-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-blog-entry',
  templateUrl: './blog-entry.component.html',
})
export class BlogEntryComponent implements OnInit {
  blogEntries?: IBlogEntry[];
  isLoading = false;

  constructor(protected blogEntryService: BlogEntryService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.blogEntryService.query().subscribe({
      next: (res: HttpResponse<IBlogEntry[]>) => {
        this.isLoading = false;
        this.blogEntries = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBlogEntry): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(blogEntry: IBlogEntry): void {
    const modalRef = this.modalService.open(BlogEntryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blogEntry = blogEntry;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
