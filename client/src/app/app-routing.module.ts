import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualityGateComponent } from './quality-gate/quality-gate.component';

const routes: Routes = [
  {
    path: "",
    component: QualityGateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
