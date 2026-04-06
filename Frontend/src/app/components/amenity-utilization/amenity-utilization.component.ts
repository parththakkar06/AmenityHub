import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-amenity-utilization',
  templateUrl: './amenity-utilization.component.html',
  styleUrl: './amenity-utilization.component.css'
})
export class AmenityUtilizationComponent implements OnInit, AfterViewInit {

  constructor(private amenityService: AmenitiesService) {}

  data: any;
  chart: any;

  ngOnInit() {
    this.amenityService.summary().subscribe({
      next: (val) => {
        this.data = val;
        this.data = this.data.data
        console.log(this.data)

        // if chart already exists → update
        if (this.chart) {
          this.updateChart();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {

  const ctx = document.getElementById('lineChart') as any;

  this.chart = new Chart(ctx, {

    type: 'bar',

    data: {

      labels: [],

      datasets: [

        {

          label: 'Utilization (hrs)',

          data: [],

          backgroundColor: [

            '#6366f1',

            '#22c55e',

            '#f59e0b',

            '#ef4444'

          ],

          borderRadius: 8

        }

      ]

    },

    options: {

      responsive: true,

      animation: {

        duration: 1200,

        easing: 'easeOutCubic'

      },

      plugins: {

        legend: {

          display: false

        },

        tooltip: {

          callbacks: {

            label: function(context) {

              return context.raw + ' hrs';

            }

          }

        }

      },

      scales: {

        y: {

          beginAtZero: true

        }

      }

    }

  });

}
 

  updateChart() {
    if (!this.data || !this.chart) return;

    // map your backend data
    const labels = Object.keys(this.data)
    const values = Object.values(this.data)

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;

    this.chart.update();
  }
}