import { Routes } from '@angular/router';
import { IndustrialMonitorComponent } from './industrial-monitor/industrial-monitor.component';
import { DrawingEditorComponent } from './drawing-editor/drawing-editor.component';
import { MapOverviewComponent } from './map-overview/map-overview.component';

import { InspectionStatusComponent } from './inspection-status/inspection-status.component';

export const routes: Routes = [
  { path: 'monitor', component: IndustrialMonitorComponent },
  { path: 'editor', component: DrawingEditorComponent },
  { path: '', component: MapOverviewComponent },
  { path: 'inspection-status', component: InspectionStatusComponent }
];
