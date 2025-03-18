import { WorkImage } from "./workImage.class";

export class UserWork {
  constructor(
    public user: number,
    public description: string,
    public title: string,
    public images: WorkImage[] = [],
    public workFiles: string[] = [],
    public id?: number
  )
  {}
}
