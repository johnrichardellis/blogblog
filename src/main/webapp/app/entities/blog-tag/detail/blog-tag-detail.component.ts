import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlogTag } from '../blog-tag.model';

@Component({
  selector: 'jhi-blog-tag-detail',
  templateUrl: './blog-tag-detail.component.html',
})
export class BlogTagDetailComponent implements OnInit {
  blogTag: IBlogTag | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blogTag }) => {
      this.blogTag = blogTag;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
