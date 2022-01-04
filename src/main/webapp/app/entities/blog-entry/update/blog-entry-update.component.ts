import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBlogEntry, BlogEntry } from '../blog-entry.model';
import { BlogEntryService } from '../service/blog-entry.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBlog } from 'app/entities/blog/blog.model';
import { BlogService } from 'app/entities/blog/service/blog.service';
import { IBlogTag } from 'app/entities/blog-tag/blog-tag.model';
import { BlogTagService } from 'app/entities/blog-tag/service/blog-tag.service';

@Component({
  selector: 'jhi-blog-entry-update',
  templateUrl: './blog-entry-update.component.html',
})
export class BlogEntryUpdateComponent implements OnInit {
  isSaving = false;

  blogsSharedCollection: IBlog[] = [];
  blogTagsSharedCollection: IBlogTag[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    content: [null, [Validators.required]],
    date: [null, [Validators.required]],
    blog: [],
    tags: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected blogEntryService: BlogEntryService,
    protected blogService: BlogService,
    protected blogTagService: BlogTagService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blogEntry }) => {
      if (blogEntry.id === undefined) {
        const today = dayjs().startOf('day');
        blogEntry.date = today;
      }

      this.updateForm(blogEntry);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('blogBlogApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blogEntry = this.createFromForm();
    if (blogEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.blogEntryService.update(blogEntry));
    } else {
      this.subscribeToSaveResponse(this.blogEntryService.create(blogEntry));
    }
  }

  trackBlogById(index: number, item: IBlog): number {
    return item.id!;
  }

  trackBlogTagById(index: number, item: IBlogTag): number {
    return item.id!;
  }

  getSelectedBlogTag(option: IBlogTag, selectedVals?: IBlogTag[]): IBlogTag {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlogEntry>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(blogEntry: IBlogEntry): void {
    this.editForm.patchValue({
      id: blogEntry.id,
      title: blogEntry.title,
      content: blogEntry.content,
      date: blogEntry.date ? blogEntry.date.format(DATE_TIME_FORMAT) : null,
      blog: blogEntry.blog,
      tags: blogEntry.tags,
    });

    this.blogsSharedCollection = this.blogService.addBlogToCollectionIfMissing(this.blogsSharedCollection, blogEntry.blog);
    this.blogTagsSharedCollection = this.blogTagService.addBlogTagToCollectionIfMissing(
      this.blogTagsSharedCollection,
      ...(blogEntry.tags ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.blogService
      .query()
      .pipe(map((res: HttpResponse<IBlog[]>) => res.body ?? []))
      .pipe(map((blogs: IBlog[]) => this.blogService.addBlogToCollectionIfMissing(blogs, this.editForm.get('blog')!.value)))
      .subscribe((blogs: IBlog[]) => (this.blogsSharedCollection = blogs));

    this.blogTagService
      .query()
      .pipe(map((res: HttpResponse<IBlogTag[]>) => res.body ?? []))
      .pipe(
        map((blogTags: IBlogTag[]) =>
          this.blogTagService.addBlogTagToCollectionIfMissing(blogTags, ...(this.editForm.get('tags')!.value ?? []))
        )
      )
      .subscribe((blogTags: IBlogTag[]) => (this.blogTagsSharedCollection = blogTags));
  }

  protected createFromForm(): IBlogEntry {
    return {
      ...new BlogEntry(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      content: this.editForm.get(['content'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      blog: this.editForm.get(['blog'])!.value,
      tags: this.editForm.get(['tags'])!.value,
    };
  }
}
