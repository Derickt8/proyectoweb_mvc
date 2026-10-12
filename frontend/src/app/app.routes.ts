import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './modules/commission/pages/commission-calculator/commission-calculator.component'
      ).then((m) => m.CommissionCalculatorComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
