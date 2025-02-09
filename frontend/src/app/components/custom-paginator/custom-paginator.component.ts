import { Component, input, output } from '@angular/core';
import { CustomSelectComponent } from '../custom-select/custom-select.component';

@Component({
  selector: 'app-custom-paginator',
  imports: [CustomSelectComponent],
  templateUrl: './custom-paginator.component.html',
  styleUrl: './custom-paginator.component.scss',
})
export class CustomPaginatorComponent {
  pageChange = output<number>();
  pageSizeChange = output<number>();

  total_entries = input(0);
  page = input(1);
  page_size = input(10);
  pageSizeOptions = input<{ value: string; title: string }[]>([
    { value: '5', title: '5' },
    { value: '10', title: '10' },
    { value: '25', title: '25' },
    { value: '100', title: '100' },
  ]);

  get totalPages(): number {
    return Math.ceil(this.total_entries() / this.page_size());
  }
  get pages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 3;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (this.page() > halfPagesToShow + 2) {
        pages.push('...');
      }
      const startPage = Math.max(2, this.page() - halfPagesToShow);
      const endPage = Math.min(
        this.totalPages - 1,
        this.page() + halfPagesToShow
      );
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (this.page() < this.totalPages - halfPagesToShow - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }

    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }

  changePageSize(page_size_string: string) {
    this.pageChange.emit(1);
    this.pageSizeChange.emit(+page_size_string);
  }
}
