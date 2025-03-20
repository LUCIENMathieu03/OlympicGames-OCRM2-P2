import { Component } from '@angular/core';
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

  tooltipText = ({
    data,
  }: {
    data: { name: string; value: number };
  }): string => {
    return `<span class="custom-tooltip">${data.name} <br> 🏅${data.value}</span>`;
  };

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
}
