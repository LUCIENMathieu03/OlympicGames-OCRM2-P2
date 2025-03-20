import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { map, Observable, of } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  countryName!: string;

  public olympics$: Observable<OlympicCountry[] | undefined | null> =
    this.olympicService.getOlympics();

  public countryDetail$: Observable<OlympicCountry | undefined | null> =
    this.olympics$.pipe(
      map((olympicTable) => {
        if (!olympicTable) return null;
        return olympicTable.find((data) => data.country === this.countryName);
      })
    );

  public medals$: Observable<number | undefined> = this.countryDetail$.pipe(
    map((country) => {
      if (!country) return undefined;
      return country.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );
    })
  );

  public athletes$: Observable<number | undefined> = this.countryDetail$.pipe(
    map((country) => {
      if (!country) return undefined;
      return country.participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );
    })
  );

  public lineChartDataTable$: Observable<
    { name: string; series: { name: string; value: Number }[] }[] | undefined
  > = this.countryDetail$.pipe(
    map((country) => {
      const tmpSeries: { name: string; value: Number }[] = [];
      if (!country) return undefined;
      country.participations.forEach((data) => {
        tmpSeries.push({ name: data.year.toString(), value: data.medalsCount });
      });
      return [
        {
          name: this.countryName,
          series: tmpSeries,
        },
      ];
    })
  );

  // countryName!: string;
  countryDetail!: OlympicCountry | undefined;
  medals!: Number | undefined;
  athletes!: Number | undefined;
  lineChartDataTable!: {
    name: string;
    series: { name: string; value: Number }[];
  }[];

  //paramettre du line chart

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
  }
}
