export type RowAction = {
  label: string;
  svgIcon: string;
  class: string;
  action: () => void;
};

export type ColumnDef<T extends object> = {
  field: Extract<keyof T, string>;
  header: string;
  headerClass: string;
  cellClass: string;
  cellRenderer?: (row: T) => string;
};
