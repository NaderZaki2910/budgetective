import { CategoryService } from './../../services/category/category.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { Category } from 'src/app/models/category.model';
import { ComponentsModule } from 'src/app/components/components.module';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonPopover } from '@ionic/angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
})
export class CategoriesPage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;
  @ViewChild('nestedPopover') nestedPopover!: IonPopover;

  categories: Category[] = [];
  categoriesMenu: Category[] = [];
  selectedCategoriesPath: Category[] = [];
  selectedCategoriesMenuPath: Category[] = [];
  selectedParentCategory?: Category;

  page: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;

  pageMenu: number = 1;
  pageSizeMenu: number = 4;
  totalItemsMenu: number = 0;

  addCategoryForm!: FormGroup;

  isAlertOpen = false;
  isPopoverOpen = false;
  isNestedPopoverOpen = false;
  alertErrorMessage = '';
  alertButtons = ['OK'];

  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.getRoot(false);
    this.addCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }
  async getAll() {
    await this.categoryService
      .getCategories(-1, -1, false) //paging parameters are redundant
      .then((result) => {
        if (!!result['categories' as keyof object]) {
          this.categories = result['categories' as keyof object];
        } else {
          console.log('wrong result');
        }
      })
      .catch((err) => console.log(err));
  }
  async getRoot(menu: boolean) {
    await this.categoryService
      .getCategories(
        !menu ? this.page : this.pageMenu,
        !menu ? this.pageSize : this.pageSizeMenu,
        true
      )
      .then((result) => {
        if (
          !!result['categories' as keyof object] &&
          !!result['totalItems' as keyof object]
        ) {
          if (!menu) {
            this.categories = result['categories' as keyof object];
            this.totalItems = result['totalItems' as keyof object];
          } else {
            this.categoriesMenu = result['categories' as keyof object];
            this.totalItemsMenu = result['totalItems' as keyof object];
          }
        } else {
          console.log('wrong result');
        }
      })
      .catch((err) => console.log(err));
  }
  async getChildren(parentId: number, menu: boolean) {
    await this.categoryService
      .getCategories(
        !menu ? this.page : this.pageMenu,
        !menu ? this.pageSize : this.pageSizeMenu,
        false,
        parentId
      )
      .then((result) => {
        if (
          !!result['categories' as keyof object] &&
          !!result['totalItems' as keyof object]
        ) {
          if (!menu) {
            this.categories = result['categories' as keyof object];
            this.totalItems = result['totalItems' as keyof object];
          } else {
            this.categoriesMenu = result['categories' as keyof object];
            this.totalItemsMenu = result['totalItems' as keyof object];
          }
        } else {
          console.log('wrong result');
        }
      })
      .catch((err) => console.log(err));
  }

  categorySelected(category: Category, menu: boolean) {
    console.log(category);
    if (category.id && category.child_count && category.child_count > 0)
      this.getChildren(category.id, menu).then(() => {
        var recurringCategory = !menu
          ? this.categories.filter((x) => x.id == category.id)
          : this.categoriesMenu.filter((x) => x.id == category.id);
        if (recurringCategory.length == 0) {
          if (!menu) this.selectedCategoriesPath.push(category);
          else this.selectedCategoriesMenuPath.push(category);
        }
      });
  }

  async back(menu: boolean) {
    var lastSelectedCategory = !menu
      ? this.selectedCategoriesPath.pop()
      : this.selectedCategoriesMenuPath.pop();
    if (lastSelectedCategory && lastSelectedCategory.child_of)
      await this.getChildren(lastSelectedCategory.child_of, menu);
    else {
      if (lastSelectedCategory) await this.getRoot(menu);
    }
  }
  async backByIndex(menu: boolean, index: number) {
    var selectedCategories = !menu
      ? this.selectedCategoriesPath
      : this.selectedCategoriesMenuPath;
    var lastSelectedCategory;
    while (selectedCategories.length - 1 >= index) {
      lastSelectedCategory = selectedCategories.pop();
    }
    if (lastSelectedCategory && lastSelectedCategory.child_of)
      await this.getChildren(lastSelectedCategory.child_of, menu);
    else {
      if (lastSelectedCategory) await this.getRoot(menu);
    }
  }
  pageChanged(page: number, menu: boolean) {
    this.page = page;
    if (
      (!menu && this.selectedCategoriesPath.length > 0) ||
      (menu && this.selectedCategoriesMenuPath.length > 0)
    ) {
      var lastSelectedCategory = !menu
        ? this.selectedCategoriesPath[this.selectedCategoriesPath.length - 1]
        : this.selectedCategoriesMenuPath[
            this.selectedCategoriesMenuPath.length - 1
          ];
      if (lastSelectedCategory && lastSelectedCategory.id)
        this.getChildren(lastSelectedCategory.id, menu);
    } else {
      this.getRoot(menu);
    }
  }
  async onWillPresentAddCategory() {
    // await this.getAll();
    await this.getRoot(true);
    this.addCategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }
  onWillDismissAddCategory($event: Event) {
    const ev = $event as CustomEvent<OverlayEventDetail<string>>;
    this.selectedParentCategory = undefined;
  }
  get addCategoryFormControls() {
    return this.addCategoryForm.controls;
  }
  addCategory() {
    if (this.addCategoryForm.valid) {
      var category: Category = {
        name: this.addCategoryFormControls['name'].value,
        child_of: this.selectedParentCategory?.id,
      };
      console.log(category);
      this.categoryService
        .addCategory(category)
        .then((result) => {
          if (result['result' as keyof Object].toString() == 'true') {
            this.popover.dismiss();
            this.getRoot(false);
          } else {
            this.alertErrorMessage =
              'Process failed. Category was not inserted.';
            this.setAlertOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
          if (!!err['err']) this.alertErrorMessage = err['err'].message;
          else this.alertErrorMessage = err.message;
          this.setAlertOpen(true);
        });
    }
  }
  setAlertOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  selectionPath(menu: Boolean): string[] {
    var selections = !menu
      ? this.selectedCategoriesPath
      : this.selectedCategoriesMenuPath;
    return selections.map((x) => x.name);
  }
  parentSelected(category: Category) {
    this.selectedParentCategory = category;
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
  }
  presentNestedPopover(e: Event) {
    this.nestedPopover.event = e;
    this.isNestedPopoverOpen = true;
  }
}
