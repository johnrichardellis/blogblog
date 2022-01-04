import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBlogTag, BlogTag } from '../blog-tag.model';
import { BlogTagService } from '../service/blog-tag.service';

@Component({
  selector: 'jhi-blog-tag-update',
  templateUrl: './blog-tag-update.component.html',
})
export class BlogTagUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(2)]],
  });

  constructor(protected blogTagService: BlogTagService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blogTag }) => {
      this.updateForm(blogTag);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const blogTag = this.createFromForm();
    if (blogTag.id !== undefined) {
      this.subscribeToSaveResponse(this.blogTagService.update(blogTag));
    } else {
      this.subscribeToSaveResponse(this.blogTagService.create(blogTag));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlogTag>>): void {
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

  protected updateForm(blogTag: IBlogTag): void {
    this.editForm.patchValue({
      id: blogTag.id,
      name: blogTag.name,
    });
  }

  protected createFromForm(): IBlogTag {
    return {
      ...new BlogTag(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
