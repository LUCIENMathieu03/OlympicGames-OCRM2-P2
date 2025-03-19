import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Paramètres du Pie Chart
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  public olympics$: Observable<OlympicCountry[] | undefined | null> =
    this.olympicService.getOlympics();

  public nbJO$: Observable<{ city: string; year: Number }[] | null> =
    this.olympics$.pipe(
      map((olympicTable) => {
        const nbJoTab: { city: string; year: Number }[] = [];
        olympicTable?.forEach((data) => {
          data.participations.forEach((participation) => {
            nbJoTab.push({
              city: participation.city,
              year: participation.year,
            });
          });
        });
        return this.nbJOcheck(nbJoTab);
      })
    );

  public pieChartData$: Observable<{ name: string; value: number }[]> =
    this.olympics$.pipe(
      map((olympicTable) => {
        if (!olympicTable) return [];
        return olympicTable.map((data) => ({
          name: data.country,
          value: data.participations.reduce((sum, p) => sum + p.medalsCount, 0),
        }));
      })
    );

  public countries$: Observable<string[]> = this.olympics$.pipe(
    map((olympicTable) => {
      if (!olympicTable) return [];
      return olympicTable?.map((data) => data.country);
    })
  );

  constructor(private olympicService: OlympicService, private router: Router) {}

  onCountryClick(data: { name: string; value: number; label: string }) {
    console.log(data);
    this.router.navigateByUrl(`detail/${data.name}`);
  }

  nbJOcheck(nbJO: { city: string; year: Number }[]) {
    const seen = new Set();

    return nbJO.filter((obj) => {
      const key = `${obj.city}-${obj.year}`; // création d'un clé pour check le combo ville de jo - année jo (au cas ou il y aurais eu plusieurs jo dans une meme ville a des année différentes)
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // pieChartData!: { name: string; value: number }[];
  // countries!: string[];
  // nbJO!: { city: string; year: Number }[];

  // ngOnInit(): void {
  //   // this.olympics$ = this.olympicService.getOlympics();
  //   // this.pieChartData = [];
  //   // this.countries = [];
  //   // this.nbJO = [];
  //   // this.olympics$.subscribe((dataTable) => {
  //   //   // console.log(dataTable);
  //   //   //preparation des donnée pour le pie chart
  //   //   dataTable?.forEach((data) => {
  //   //     let nbMedal = 0;
  //   //     data.participations.forEach((participation) => {
  //   //       nbMedal += participation.medalsCount;
  //   //       this.nbJO.push({
  //   //         city: participation.city,
  //   //         year: participation.year,
  //   //       });
  //   //     });
  //   //     const dataValue = { name: data.country, value: nbMedal };
  //   //     this.pieChartData.push(dataValue);
  //   //     this.countries.push(data.country);
  //   //   });
  //   //   this.nbJO = this.nbJOcheck(this.nbJO); //retire les doublons
  //   // });
  // }
}
