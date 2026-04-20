import { Component, ViewEncapsulation, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from 'gojs-angular';
import * as go from 'gojs';
import { DiagramService } from '../services/diagram.service';
import { 
  colors, tank1, tank3, equipment, 
  labelLeft, labelRight, valve, pump, sensor 
} from '../industrial-monitor/diagram-data';

@Component({
  selector: 'app-drawing-editor',
  standalone: true,
  imports: [CommonModule, DiagramComponent],
  templateUrl: './drawing-editor.component.html',
  styleUrls: ['./drawing-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawingEditorComponent implements OnInit, OnDestroy {
  public diagramNodeData: Array<go.ObjectData> = [];
  public diagramLinkData: Array<go.ObjectData> = [];
  public diagramModelData = { prop: 'value' };
  public diagramDivClassName: string = 'myDiagramDiv';
  public skipsDiagramUpdate = false;

  @ViewChild('myDiag', { static: false }) public myDiag!: DiagramComponent;

  private subscription: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private diagramService: DiagramService
  ) {}

  ngOnInit(): void {
    this.subscription = this.diagramService.nodeData$.subscribe(() => {
       this.refreshData();
    });
    this.refreshData();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private refreshData() {
    this.diagramNodeData = this.diagramService.getCurrentNodeData();
    this.diagramLinkData = this.diagramService.getCurrentLinkData();
    this.cdr.detectChanges();
  }

  public initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = new go.Diagram({
      'animationManager.isEnabled': false,
      'undoManager.isEnabled': true,
      allowMove: true, // ENABLED FOR EDITOR
      allowCopy: true,
      allowDelete: true,
      model: $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        linkKeyProperty: 'key',
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort'
      })
    });

    const textDefaults = { font: '10px InterVariable, sans-serif', stroke: colors.white };

    const tankPort = $(go.Panel,
      new go.Binding('alignment', 'a', go.Spot.parse),
      new go.Binding('portId', 'p'),
      new go.Binding('fromSpot', 'fs', go.Spot.parse),
      new go.Binding('toSpot', 'ts', go.Spot.parse),
      $(go.Shape, 'Diamond', { width: 10, height: 10, fill: colors.white })
    );

    // TEMPLATES (No Modals, simpler structure)
    diagram.nodeTemplateMap.add('',
      $(go.Node, 'Spot', { itemTemplate: tankPort },
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding('itemArray', 'ports'),
        $(go.Panel, 'Spot',
          $(go.Shape, {
            geometryString: tank1,
            strokeWidth: 1,
            stroke: 'gray',
            width: 75,
            height: 140,
            fill: colors.white
          },
            new go.Binding('width'),
            new go.Binding('height'),
            new go.Binding('geometryString', 'tankType')
          ),
          $(go.TextBlock, { font: 'bold 13px InterVariable, sans-serif', stroke: colors.black },
            new go.Binding('text', 'key')
          )
        )
      )
    );

    diagram.nodeTemplateMap.add('label',
      $(go.Node, 'Spot',
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          $(go.Shape, {
            geometryString: labelRight,
            strokeWidth: 4,
            fill: colors.black
          },
            new go.Binding('width'),
            new go.Binding('height'),
            new go.Binding('geometryString', 'direction', (d: any) => d === 'right' ? labelRight : labelLeft),
            new go.Binding('stroke', 'color')
          ),
          $(go.TextBlock, {
            margin: new go.Margin(8, 40, 8, 8),
            textAlign: 'center',
            font: '12px sans-serif',
            stroke: colors.white
          },
            new go.Binding('margin', 'direction', (d: any) => d === 'right' ? new go.Margin(8, 40, 8, 8) : new go.Margin(8, 8, 8, 40)),
            new go.Binding('text')
          )
        ),
        $(go.TextBlock, {
          font: 'bold 12px InterVariable, sans-serif',
          stroke: colors.white,
          alignment: go.Spot.Top,
          alignmentFocus: go.Spot.Bottom
        },
          new go.Binding('text', 'subText')
        )
      )
    );

    diagram.nodeTemplateMap.add('valve',
      $(go.Node, 'Vertical', { rotatable: true },
        new go.Binding('angle').makeTwoWay(),
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.TextBlock, { ...textDefaults, background: colors.black, margin: 2 }, new go.Binding('text', 'key')),
        $(go.Shape, { geometryString: valve, strokeWidth: 2 },
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'color', (c: any) => go.Brush.darkenBy(c, 0.3))
        )
      )
    );

    diagram.nodeTemplateMap.add('pump',
      $(go.Node, 'Spot', { rotatable: true },
        new go.Binding('angle').makeTwoWay(),
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, { geometryString: pump, width: 45, height: 45, strokeWidth: 2 },
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'color', (c: any) => go.Brush.darkenBy(c, 0.3))
        ),
        $(go.TextBlock, { font: 'bold 10px InterVariable, sans-serif', stroke: colors.white }, new go.Binding('text', 'key'))
      )
    );

    diagram.linkTemplateMap.add('',
      $(go.Link, { routing: go.Routing.AvoidsNodes, corner: 12 },
        $(go.Shape, { strokeWidth: 8, stroke: colors.black }),
        $(go.Shape, { strokeWidth: 3.5, stroke: colors.green }, new go.Binding('stroke', 'color')),
        $(go.Shape, { toArrow: 'Triangle', stroke: colors.green, fill: colors.green }, new go.Binding('fill', 'color'))
      )
    );

    return diagram;
  }

  public saveChanges() {
    if (!this.myDiag || !this.myDiag.diagram) return;

    // Capture the latest data from the GoJS model
    const nodeData = JSON.parse(this.myDiag.diagram.model.toJson()).nodeDataArray;
    const linkData = JSON.parse(this.myDiag.diagram.model.toJson()).linkDataArray;

    this.diagramService.saveDiagram(nodeData, linkData);
    alert('Changes saved to memory and local storage!');
  }

  public resetToDefaults() {
    if (confirm('Are you sure you want to reset to original data?')) {
      this.diagramService.resetToDefaults();
    }
  }

  public onModelChange(event: any) {}
}
