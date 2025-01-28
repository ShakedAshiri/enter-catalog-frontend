import { DataTable } from "./dataTable.class";

export class Category extends DataTable {
  constructor(id: string,
              data: string,
              public displayName: string) {
    super(id, data);
  }
}
