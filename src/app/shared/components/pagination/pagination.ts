import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {

  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const result: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  });

  goTo(page: number): void {
    if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

}
