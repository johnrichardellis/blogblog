import { IBlogEntry } from 'app/entities/blog-entry/blog-entry.model';

export interface IBlogTag {
  id?: number;
  name?: string;
  entries?: IBlogEntry[] | null;
}

export class BlogTag implements IBlogTag {
  constructor(public id?: number, public name?: string, public entries?: IBlogEntry[] | null) {}
}

export function getBlogTagIdentifier(blogTag: IBlogTag): number | undefined {
  return blogTag.id;
}
