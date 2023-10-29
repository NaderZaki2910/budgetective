import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
})
export class PagingComponent implements OnInit {
  @Input() set size(pageSize: number) {
    this.pageSize = pageSize;
    this.totalPages =
      Math.ceil(this.totalItems / this.pageSize) > 0
        ? Math.ceil(this.totalItems / this.pageSize)
        : 1;
  }
  @Input() set itemsAmount(totalItems: number) {
    this.totalItems = totalItems;
    console.log(this.pageSize, this.totalItems);
    this.totalPages =
      Math.ceil(this.totalItems / this.pageSize) > 0
        ? Math.ceil(this.totalItems / this.pageSize)
        : 1;
  }
  @Output() curPage = new EventEmitter<number>();
  pageSize: number = 1;
  totalItems: number = 1;
  totalPages = 1;
  page = 1;
  constructor() {}

  ngOnInit() {}

  next() {
    if (this.page < this.totalPages) this.page++;
    else {
      this.page = this.totalPages;
    }
    this.curPage.emit(this.page);
  }
  last() {
    this.page = this.totalPages;
    this.curPage.emit(this.page);
  }
  previous() {
    if (this.page > 1) this.page--;
    else {
      this.page = 1;
    }
    this.curPage.emit(this.page);
  }
  first() {
    this.page = 1;
    this.curPage.emit(this.page);
  }
}
