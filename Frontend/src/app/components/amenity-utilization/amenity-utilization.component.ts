import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Chart } from 'chart.js/auto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-amenity-utilization',
  templateUrl: './amenity-utilization.component.html',
  styleUrl: './amenity-utilization.component.css'
})
export class AmenityUtilizationComponent implements OnInit, AfterViewInit {

  constructor(private location: Location, private amenityService: AmenitiesService) { }

  data: any = {};
  chart: any;

  ngOnInit() {
    this.amenityService.summary().subscribe({
      next: (val: any) => {
        this.data = val?.data || val || {};
        console.log("Fetched summary:", this.data)
        this.updateChart();
      },
      error: (err) => {
        console.error("Error fetching summary:", err)
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.updateChart();
  }

  back() {
    this.location.back()
  }

  createChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx) return;

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
              label: function (context) {
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

    const labels = Object.keys(this.data)
    const values = Object.values(this.data)

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;

    this.chart.update();
  }
}