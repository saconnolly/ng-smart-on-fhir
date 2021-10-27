import {Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, NgZone} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'app-therapy-data',
  templateUrl: './therapy-data.component.html',
  styleUrls: ['./therapy-data.component.css']
})
export class TherapyDataComponent implements OnDestroy, AfterViewInit {
  public chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.data = [{
      'x': 1,
      'ay': 6.5,
      'by': 2.2,
      'aValue': 15,
      'bValue': 10
    }, {
      'x': 2,
      'ay': 12.3,
      'by': 4.9,
      'aValue': 8,
      'bValue': 3
    }, {
      'x': 3,
      'ay': 12.3,
      'by': 5.1,
      'aValue': 16,
      'bValue': 4
    }, {
      'x': 5,
      'ay': 2.9,
      'aValue': 9
    }, {
      'x': 7,
      'by': 8.3,
      'bValue': 13
    }, {
      'x': 10,
      'ay': 2.8,
      'by': 13.3,
      'aValue': 9,
      'bValue': 13
    }, {
      'x': 12,
      'ay': 3.5,
      'by': 6.1,
      'aValue': 5,
      'bValue': 2
    }, {
      'x': 13,
      'ay': 5.1,
      'aValue': 10
    }, {
      'x': 15,
      'ay': 6.7,
      'by': 10.5,
      'aValue': 3,
      'bValue': 10
    }, {
      'x': 16,
      'ay': 8,
      'by': 12.3,
      'aValue': 5,
      'bValue': 13
    }, {
      'x': 20,
      'by': 4.5,
      'bValue': 11
    }, {
      'x': 22,
      'ay': 9.7,
      'by': 15,
      'aValue': 15,
      'bValue': 10
    }, {
      'x': 23,
      'ay': 10.4,
      'by': 10.8,
      'aValue': 1,
      'bValue': 11
    }, {
      'x': 24,
      'ay': 1.7,
      'by': 19,
      'aValue': 12,
      'bValue': 3
    }];

// Create axes
    const xAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.minGridDistance = 40;

// Create value axis
    const yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

// Create series
    const series1 = this.chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueX = 'x';
    series1.dataFields.valueY = 'ay';
    series1.dataFields.value = 'aValue';
    series1.strokeWidth = 2;

    const bullet1 = series1.bullets.push(new am4charts.CircleBullet());
    series1.heatRules.push({
      target: bullet1.circle,
      min: 5,
      max: 20,
      property: 'radius'
    });

    bullet1.tooltipText = '{valueX} x {valueY}: [bold]{value}[/]';

    const series2 = this.chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueX = 'x';
    series2.dataFields.valueY = 'by';
    series2.dataFields.value = 'bValue';
    series2.strokeWidth = 2;

    const bullet2 = series2.bullets.push(new am4charts.CircleBullet());
    series2.heatRules.push({
      target: bullet2.circle,
      min: 5,
      max: 20,
      property: 'radius'
    });

    bullet2.tooltipText = '{valueX} x {valueY}: [bold]{value}[/]';

    this.chart.scrollbarX = new am4core.Scrollbar();
    this.chart.scrollbarY = new am4core.Scrollbar();

  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
