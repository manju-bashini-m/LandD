import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import {
  ChartData,
  ChartOptions,
  ChartType,
  Chart,
  Plugin
} from 'chart.js';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent {

  // ✅ Custom plugin to round all bars
  roundedBarsPlugin: Plugin<'bar'> = {
    id: 'roundedBars',
    beforeDatasetsDraw(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar: any) => {
          const { x, y, base, width } = bar;
          const radius = 10;

          const barTop = Math.min(y, base);
          const barHeight = Math.abs(base - y);

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = dataset.backgroundColor as string;

          const left = x - width / 2;
          const right = x + width / 2;
          const top = barTop;
          const bottom = barTop + barHeight;

          // Draw full-rounded bar
          ctx.moveTo(left + radius, top);
          ctx.lineTo(right - radius, top);
          ctx.quadraticCurveTo(right, top, right, top + radius);
          ctx.lineTo(right, bottom - radius);
          ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
          ctx.lineTo(left + radius, bottom);
          ctx.quadraticCurveTo(left, bottom, left, bottom - radius);
          ctx.lineTo(left, top + radius);
          ctx.quadraticCurveTo(left, top, left + radius, top);
          ctx.fill();
          ctx.restore();
        });
      });

      // Prevent default drawing
      return false;
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 20
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 500
        }
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Impact', 'COE', 'Internship', 'Shine', 'RMG'],
    datasets: [
      {
        label: 'Total Trainees',
        data: [300, 450, 800, 350, 700],
        backgroundColor: '#f76c9c',
        barThickness: 30
      },
      {
        label: 'Active Trainees',
        data: [150, 200, 300, 200, 250],
        backgroundColor: '#87b4f9',
        barThickness: 30
      },
      {
        label: 'Moved to Project',
        data: [100, 150, 300, 200, 250],
        backgroundColor: '#7fd3a1',
        barThickness: 30
      }
    ]
  };

  barChartType: 'bar' = 'bar';

  // 🔌 Register plugin globally (if not already)
  constructor() {
    Chart.register(this.roundedBarsPlugin);
  }
}
