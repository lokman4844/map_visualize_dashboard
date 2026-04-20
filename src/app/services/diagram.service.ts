import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DIAGRAM_NODE_DATA, DIAGRAM_LINK_DATA } from '../industrial-monitor/diagram-data';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private readonly STORAGE_KEY = 'myinspect_diagram_data';

  private nodeDataSubject = new BehaviorSubject<any[]>(this.loadInitialNodeData());
  private linkDataSubject = new BehaviorSubject<any[]>(this.loadInitialLinkData());

  nodeData$ = this.nodeDataSubject.asObservable();
  linkData$ = this.linkDataSubject.asObservable();

  constructor() {}

  private loadInitialNodeData(): any[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodeData) return parsed.nodeData;
      } catch (e) {
        console.error('Failed to parse saved node data', e);
      }
    }
    return [...DIAGRAM_NODE_DATA];
  }

  private loadInitialLinkData(): any[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.linkData) return parsed.linkData;
      } catch (e) {
        console.error('Failed to parse saved link data', e);
      }
    }
    return [...DIAGRAM_LINK_DATA];
  }

  saveDiagram(nodeData: any[], linkData: any[]) {
    // Update Subjects
    this.nodeDataSubject.next(nodeData);
    this.linkDataSubject.next(linkData);

    // Persist to LocalStorage
    const payload = {
      nodeData,
      linkData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
  }

  getCurrentNodeData(): any[] {
    return this.nodeDataSubject.value;
  }

  getCurrentLinkData(): any[] {
    return this.linkDataSubject.value;
  }
  
  resetToDefaults() {
    this.saveDiagram([...DIAGRAM_NODE_DATA], [...DIAGRAM_LINK_DATA]);
  }
}
