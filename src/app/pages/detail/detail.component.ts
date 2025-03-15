import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Observable, of } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | undefined | null> = of(null);
  countryName!: string;
  countryDetail!: OlympicCountry | undefined;
  medals!: Number | undefined;
  athletes!: Number | undefined;
  lineChartDataTable!: {
    name: string;
    series: { name: string; value: Number }[];
  }[];

  //paramettre du line chart
  view: [number, number] = [700, 300];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'medals';
  timeline: boolean = true;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.countryName = decodeURIComponent(
      this.route.snapshot.params['countryName']
    );

    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe((dataTable) => {
      this.countryDetail = dataTable?.find(
        (data) => data.country === this.countryName
      );
    });

    console.log(this.countryDetail);

    this.medals = this.countryDetail?.participations.reduce((acc, value) => {
      return acc + value.medalsCount;
    }, 0);

    this.athletes = this.countryDetail?.participations.reduce((acc, value) => {
      return acc + value.athleteCount;
    }, 0);

    const tmpSeries: { name: string; value: Number }[] = [];

    this.countryDetail?.participations.forEach((data) => {
      tmpSeries.push({ name: data.year.toString(), value: data.medalsCount });
    });

    this.lineChartDataTable = [
      {
        name: this.countryName,
        series: tmpSeries,
      },
    ];

    // console.log(this.countryDetail);
    console.log(this.lineChartDataTable);
  }
}
