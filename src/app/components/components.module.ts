import { NgModule } from '@angular/core';
import { PagingComponent } from './paging/paging.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
@NgModule({
  declarations: [PagingComponent, DoughnutChartComponent],
  imports: [IonicModule, CommonModule],
  exports: [PagingComponent, DoughnutChartComponent],
})
export class ComponentsModule {}
