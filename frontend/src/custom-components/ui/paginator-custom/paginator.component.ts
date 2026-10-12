import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent {
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 1;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  goToPage(page: number): void {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.pageChange.emit(page);
    }
  }

  getPageOptions(): number[] {
    const totalPages = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    const maxPages = 3;
    let startPage = Math.max(1, this.pageIndex - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }

  hasMorePages(): boolean {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    return this.pageIndex < totalPages;
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(select.value));
  }
}
