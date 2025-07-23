import { Component } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';



@Component({
  selector: 'app-dashboard-page',
  imports: [NgChartsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
   barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Trainees', 'Internship', 'COE', 'Total'],
    datasets: [
      {
        label: 'Count',
        data: [4580, 680, 587, 9000],
        backgroundColor: '#8347ad'
      }
    ]
  };

  barChartType: 'bar' = 'bar';

   
}
