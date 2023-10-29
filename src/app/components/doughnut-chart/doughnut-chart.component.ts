import { Component, Input, OnInit } from '@angular/core';
import { Chart, Colors } from 'chart.js/auto';
import Stat from 'src/app/models/stats.model';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit {
  @Input() id = '';
  @Input() set setData(data: Stat[]) {
    this.data = data;
    this.createChart();
  }
  public chart!: Chart<'doughnut', number[], string>;
  data: Stat[] = [];
  constructor() {}

  ngOnInit() {
    Chart.register(Colors);
  }
  createChart() {
    if (this.data.length > 0) {
      var dynamicColors = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      };
      if (!!this.chart) this.chart.destroy();
      this.chart = new Chart(this.id, {
        type: 'doughnut',
        data: {
          // values on X-Axis
          labels: this.data.map((x) => x.name),
          datasets: [
            {
              // label: 'Owed',
              data: this.data.map((x) => x.percentage),
              backgroundColor: dynamicColors,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'right',
              align: 'end',
              labels: {
                font: {
                  weight: 'bold',
                },
              },
            },
            colors: {
              forceOverride: true,
            },
          },
          aspectRatio: 2,
        },
      });
    }
  }
}
