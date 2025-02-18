import { WorkImage } from './workImage.class';

export class UserWork {
  constructor(
    public description: string,
    public title: string,
    public images: WorkImage[] // thumbnail
  ) // file
  {}
}
