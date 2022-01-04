import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlogEntry } from '../blog-entry.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-blog-entry-detail',
  templateUrl: './blog-entry-detail.component.html',
})
export class BlogEntryDetailComponent implements OnInit {
  blogEntry: IBlogEntry | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blogEntry }) => {
      this.blogEntry = blogEntry;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
