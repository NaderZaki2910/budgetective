import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  async addCategory(Category: Category) {
    return await firstValueFrom(
      this.http.post(`${environment.api}/Category/addCategory`, Category)
    );
  }
  async getCategories(
    page: number,
    pageSize: number,
    getRoot: boolean,
    parentId?: number
  ) {
    if (!parentId)
      return await firstValueFrom(
        this.http.get(
          `${environment.api}/Category/getCategories?page=${page}&pageSize=${pageSize}&getRoot=${getRoot}`
        )
      );
    else
      return await firstValueFrom(
        this.http.get(
          `${environment.api}/Category/getCategories?page=${page}&pageSize=${pageSize}&getRoot=${getRoot}&parentId=${parentId}`
        )
      );
  }
  // async getCategoriesStats() {
  //   return await firstValueFrom(
  //     this.http.get(`${environment.api}/Category/getCategoriesStats`)
  //   );
  // }
}
