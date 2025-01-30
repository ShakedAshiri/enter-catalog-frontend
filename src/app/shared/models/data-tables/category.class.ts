import { DataTable } from "./dataTable.class";

export class Category extends DataTable {
  constructor(id: number,
              name: string,
              public displayName: string) {
    super(id, name);
  }
}
