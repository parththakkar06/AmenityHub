import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AmenitiesService } from '../../services/amenities.service';
import { Chart } from 'chart.js';
import { CommonModule, DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-booking-trend',
  imports: [CommonModule],
  templateUrl: './booking-trend.component.html',
  styleUrl: './booking-trend.component.css'
})
export class BookingTrendComponent implements OnInit, AfterViewInit {

  constructor(private amenityService: AmenitiesService,private location : Location) { }

  data: any
  chart: any
  ngOnInit() {
    this.amenityService.trend().subscribe({
      next: (trend) => {
        this.data = trend
        this.data = this.data.data
        console.log(this.data)
        if (this.chart) {
          this.updateChart();
        }
      },
      error: (e) => {
        console.error(e)
      }
    })


  }


  ngAfterViewInit(): void {
    this.createChart();
  }

  back(){
    this.location.back()
  }

  createChart() {

    const ctx = document.getElementById('lineChart') as any;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Revenue (Rs.)',
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
                return  'Rs.' + context.raw ;
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

    const months = this.data.map((d:any) => {
      const month = new Date(d._id).toLocaleString('default',{month:'long'})
      const year = new Date(d._id).getFullYear()
      return {...d , month , year}
    })

    const labels = months.map((data: any) => data.month+','+data.year)
    const values = this.data.map((data: any) => data.totalRevenue)
    console.log(labels)
    console.log('month...',months)
    
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;

    this.chart.update();
  }

}
