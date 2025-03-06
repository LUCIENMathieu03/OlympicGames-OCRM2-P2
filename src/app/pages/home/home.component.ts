import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | undefined | null> = of(null);
  pieChartData!: { name: string; value: number }[];

  // Paramètres du Pie Chart
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.pieChartData = [];

    this.olympics$.subscribe((dataTable) => {
      console.log(dataTable);

      //preparation des donnée pour le pie chart
      dataTable?.forEach((data) => {
        let nbMedal = 0;
        data.participations.forEach((participation) => {
          nbMedal += participation.medalsCount;
        });

        const dataValue = { name: data.country, value: nbMedal };
        this.pieChartData?.push(dataValue);
      });

      console.log(this.pieChartData);
    });
  }
}
