import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Chart } from 'chart.js/auto';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-booking-trend',
  imports: [CommonModule],
  templateUrl: './booking-trend.component.html',
  styleUrl: './booking-trend.component.css'
})
export class BookingTrendComponent implements OnInit, AfterViewInit {

  constructor(
    private amenityService: AmenitiesService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  data: any[] = [];
  chart: any;
  isLoaded = false;
  totalMonthlyRevenue = 0;
  totalMonthlyBookings = 0;

  ngOnInit() {
    this.amenityService.trend().subscribe({
      next: (trend: any) => {
        this.data = Array.isArray(trend) ? trend : (trend?.data || []);
        console.log("Fetched monthly trend data:", this.data);

        // Calculate totals across months
        this.totalMonthlyRevenue = 0;
        this.totalMonthlyBookings = 0;
        for (const item of this.data) {
          this.totalMonthlyRevenue += (Number(item?.totalRevenue) || 0);
          this.totalMonthlyBookings += (Number(item?.totalBookings) || 0);
        }

        this.isLoaded = true;
        this.updateChart();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error("Error fetching trends:", e);
        this.data = [];
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.updateChart();
  }

  back() {
    this.location.back();
  }

  getMonthName(monthNum: number): string {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[(monthNum - 1) % 12] || "Unknown";
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
            label: 'Monthly Revenue (₹)',
            data: [],
            backgroundColor: '#1F3D2E', /* Solid Deep Forest Green */
            hoverBackgroundColor: '#C05621', /* Burnt Terracotta Accent on Hover */
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeOutCubic'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#162E22',
            titleColor: '#FAF6EE',
            bodyColor: '#FAF6EE',
            titleFont: {
              family: 'Fraunces, Georgia, serif',
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: 'Inter, sans-serif',
              size: 13
            },
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return 'Revenue: ₹' + Number(context.raw).toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#52524E',
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                weight: 600
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E7E2D8'
            },
            ticks: {
              color: '#52524E',
              font: {
                family: 'Inter, sans-serif',
                size: 12
              },
              callback: function (value) {
                return '₹' + value;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (!this.data || !Array.isArray(this.data) || !this.chart) return;

    const labels: string[] = [];
    const values: number[] = [];

    this.data.forEach((item: any) => {
      if (item._id && typeof item._id === 'object') {
        const year = item._id.year;
        const monthStr = this.getMonthName(item._id.month);
        labels.push(`${monthStr}, ${year}`);
      } else if (item._id) {
        const dateObj = new Date(item._id);
        const monthStr = isNaN(dateObj.getTime()) ? 'N/A' : dateObj.toLocaleString('default', { month: 'long' });
        const yearStr = isNaN(dateObj.getTime()) ? '' : dateObj.getFullYear();
        labels.push(yearStr ? `${monthStr}, ${yearStr}` : monthStr);
      } else {
        labels.push('Monthly Trend');
      }
      values.push(Number(item.totalRevenue) || 0);
    });

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;

    // Apply Burnt Terracotta highlight color to peak revenue month
    if (values.length > 0) {
      const maxVal = Math.max(...values);
      const bgColors = values.map(val => (val === maxVal && maxVal > 0) ? '#C05621' : '#1F3D2E');
      this.chart.data.datasets[0].backgroundColor = bgColors;
    }

    this.chart.update();
  }
}
