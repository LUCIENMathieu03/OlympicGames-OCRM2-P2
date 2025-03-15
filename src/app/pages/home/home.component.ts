import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | undefined | null> = of(null);
  pieChartData!: { name: string; value: number }[];
  countries!: string[];
  nbJO!: { city: string; year: Number }[];

  // Paramètres du Pie Chart
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.pieChartData = [];
    this.countries = [];
    this.nbJO = [];

    this.olympics$.subscribe((dataTable) => {
      // console.log(dataTable);

      //preparation des donnée pour le pie chart
      dataTable?.forEach((data) => {
        let nbMedal = 0;
        data.participations.forEach((participation) => {
          nbMedal += participation.medalsCount;

          this.nbJO.push({
            city: participation.city,
            year: participation.year,
          });
        });

        const dataValue = { name: data.country, value: nbMedal };
        this.pieChartData.push(dataValue);
        this.countries.push(data.country);
      });

      this.nbJO = this.nbJOcheck(this.nbJO); //retire les doublons
    });
  }

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
}
