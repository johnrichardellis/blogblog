import dayjs from 'dayjs/esm';
import { IBlog } from 'app/entities/blog/blog.model';
import { IBlogTag } from 'app/entities/blog-tag/blog-tag.model';

export interface IBlogEntry {
  id?: number;
  title?: string;
  content?: string;
  date?: dayjs.Dayjs;
  blog?: IBlog | null;
  tags?: IBlogTag[] | null;
}

export class BlogEntry implements IBlogEntry {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public date?: dayjs.Dayjs,
    public blog?: IBlog | null,
    public tags?: IBlogTag[] | null
  ) {}
}

export function getBlogEntryIdentifier(blogEntry: IBlogEntry): number | undefined {
  return blogEntry.id;
}
