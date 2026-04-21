import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface InspectionItem {
  id: string;
  name: string;
  status: 'Green' | 'Yellow' | 'Red';
  lastInspection: string;
  nextInspection: string;
  integrityScore: number;
  findings?: string;
  type: 'Pipeline' | 'Equipment';
}

@Component({
  selector: 'app-inspection-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inspection-status.component.html',
  styleUrls: ['./inspection-status.component.scss']
})
export class InspectionStatusComponent implements OnInit {
  assetId = 'SAP-BLOCK-SKV311';
  dashboardTitle = 'Asset Integrity & Inspection Dashboard';
  lastSync = new Date().toLocaleString();

  pipelines: InspectionItem[] = [
    {
      id: 'PL-001',
      name: 'Main Trunk Line (Export)',
      status: 'Green',
      lastInspection: '2026-03-15',
      nextInspection: '2026-09-15',
      integrityScore: 98,
      type: 'Pipeline'
    },
    {
      id: 'PL-005',
      name: 'Subsea Production Header',
      status: 'Yellow',
      lastInspection: '2025-11-20',
      nextInspection: '2026-05-20',
      integrityScore: 82,
      findings: 'Minor pitting detected @ 4.2km',
      type: 'Pipeline'
    },
    {
      id: 'PL-012',
      name: 'Flare Gas Disposal Line',
      status: 'Red',
      lastInspection: '2025-08-10',
      nextInspection: '2026-02-10',
      integrityScore: 65,
      findings: 'Critical wall thinning detected',
      type: 'Pipeline'
    }
  ];

  equipment: InspectionItem[] = [
    {
      id: 'K-100A',
      name: 'LP Compressor Unit',
      status: 'Green',
      lastInspection: '2026-04-01',
      nextInspection: '2026-10-01',
      integrityScore: 95,
      type: 'Equipment'
    },
    {
      id: 'V-201',
      name: 'High-Pressure Separator',
      status: 'Green',
      lastInspection: '2026-01-15',
      nextInspection: '2027-01-15',
      integrityScore: 99,
      type: 'Equipment'
    },
    {
      id: 'P-302B',
      name: 'Condensate Export Pump',
      status: 'Yellow',
      lastInspection: '2026-02-10',
      nextInspection: '2026-05-10',
      integrityScore: 78,
      findings: 'Seal leak alert',
      type: 'Equipment'
    },
    {
      id: 'E-501',
      name: 'Main Flare Stack',
      status: 'Red',
      lastInspection: '2025-12-05',
      nextInspection: '2026-03-05',
      integrityScore: 45,
      findings: 'Structural fatigue detected',
      type: 'Equipment'
    }
  ];

  overallStats = [
    { label: 'Pipeline Integrity', value: 92, color: '#4ade80' },
    { label: 'Equipment Health', value: 85, color: '#fbbf24' },
    { label: 'Risk Coverage', value: 100, color: '#38bdf8' }
  ];

  ngOnInit(): void { }

  getGaugeStyle(value: number) {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;
    return {
      'stroke-dasharray': `${circumference} ${circumference}`,
      'stroke-dashoffset': offset
    };
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Green': return 'bg-green-500 shadow-green-500/50';
      case 'Yellow': return 'bg-yellow-500 shadow-yellow-500/50';
      case 'Red': return 'bg-red-500 shadow-red-500/50 animate-pulse';
      default: return 'bg-gray-500';
    }
  }
}
