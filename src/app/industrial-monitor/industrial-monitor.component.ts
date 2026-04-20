import { Component, ViewEncapsulation, ChangeDetectorRef, signal, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from 'gojs-angular';
import * as go from 'gojs';
import { DataSyncService } from 'gojs-angular';
import {
  colors, tank1, tank3, equipment,
  labelLeft, labelRight, valve, pump, sensor
} from './diagram-data';
import { DiagramService } from '../services/diagram.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-industrial-monitor',
  standalone: true,
  imports: [CommonModule, DiagramComponent],
  templateUrl: './industrial-monitor.component.html',
  styleUrls: ['./industrial-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndustrialMonitorComponent implements OnInit, OnDestroy {
  public diagramNodeData!: Array<go.ObjectData>;
  public diagramLinkData!: Array<go.ObjectData>;
  public diagramModelData = { prop: 'value' };
  public diagramDivClassName: string = 'myDiagramDiv';
  public colors = colors;


  public skipsDiagramUpdate = false;
  public selectedNodeData: any = null;

  private simulationInterval: any;
  private subscription: Subscription | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private diagramService: DiagramService
  ) { }

  ngOnInit(): void {
    // Sync with service
    this.subscription = this.diagramService.nodeData$.subscribe(() => {
      this.initData();
    });

    // interval for simulated data
    this.simulationInterval = setInterval(() => {
      this.simulateData();
    }, 550);
  }

  ngOnDestroy() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = new go.Diagram({
      'animationManager.isEnabled': false,
      'undoManager.isEnabled': true,
      'rotatingTool.snapAngleMultiple': 90,
      'rotatingTool.snapAngleEpsilon': 45,
      allowMove: false,
      model: $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        linkKeyProperty: 'key',
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort'
      })
    });

    diagram.addDiagramListener('ObjectDoubleClicked', (e: go.DiagramEvent) => {
      const part = e.subject.part;
      if (part instanceof go.Node || part instanceof go.Link) {
        this.openModal(part.data);
      }
    });
    const textDefaults = { font: '10px InterVariable, sans-serif', stroke: colors.white };

    const tankPort = $(go.Panel,
      new go.Binding('alignment', 'a', go.Spot.parse),
      new go.Binding('portId', 'p'),
      new go.Binding('fromSpot', 'fs', go.Spot.parse),
      new go.Binding('toSpot', 'ts', go.Spot.parse),
      $(go.Shape, 'Diamond', { width: 10, height: 10, fill: colors.white })
    );

    diagram.nodeTemplateMap.add('',
      $(go.Node, 'Spot',
        {
          itemTemplate: tankPort,
          doubleClick: (e: go.InputEvent, obj: go.GraphObject) => {
            const node = obj.part as go.Node;
            if (node) this.openModal(node.data);
          }
        },
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
            new go.Binding('geometryString', 'tankType'),
            new go.Binding('fill', 'color')
          ),
          $(go.TextBlock, {
            font: 'bold 13px InterVariable, sans-serif',
            stroke: colors.black
          },
            new go.Binding('text', 'key')
          )
        )
      )
    );

    diagram.nodeTemplateMap.add('label',
      $(go.Node, 'Spot',
        {
          doubleClick: (e: go.InputEvent, obj: go.GraphObject) => {
            const node = obj.part as go.Node;
            if (node) this.openModal(node.data);
          }
        },
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          $(go.Shape, {
            portId: '',
            fromSpot: go.Spot.Right,
            toSpot: go.Spot.LeftRightSides,
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
            stroke: colors.white,
            alignment: new go.Spot(0.1, 0.5)
          },
            new go.Binding('margin', 'direction', (d: any) => d === 'right' ? new go.Margin(8, 40, 8, 8) : new go.Margin(8, 8, 8, 40)),
            new go.Binding('alignment', 'direction', (d: any) => d === 'right' ? new go.Spot(0.3, 0.5) : new go.Spot(0.7, 0.5)),
            new go.Binding('text')
          )
        ),
        $(go.TextBlock, {
          font: 'bold 12px InterVariable, sans-serif',
          stroke: colors.white,
          margin: new go.Margin(0, 0, 4, 0),
          alignment: go.Spot.Top,
          alignmentFocus: go.Spot.Bottom
        },
          new go.Binding('text', 'subText')
        )
      )
    );

    diagram.nodeTemplateMap.add('valve',
      $(go.Node, 'Vertical', {
        locationSpot: new go.Spot(0.5, 1, 0, -21),
        locationObjectName: 'SHAPE',
        selectionObjectName: 'SHAPE',
        rotatable: true,
        doubleClick: (e: go.InputEvent, obj: go.GraphObject) => {
          const node = obj.part as go.Node;
          if (node) this.openModal(node.data);
        }
      },
        new go.Binding('angle').makeTwoWay(),
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.TextBlock, {
          background: colors.black,
          alignment: go.Spot.Center,
          textAlign: 'center',
          margin: 2,
          editable: false,
          ...textDefaults
        },
          new go.Binding('text', 'key'),
          new go.Binding('angle', 'angle', (a: any) => a === 180 ? 180 : 0).ofObject()
        ),
        $(go.Shape, {
          name: 'SHAPE',
          geometryString: valve,
          strokeWidth: 2,
          portId: '',
          fromSpot: new go.Spot(1, 0.35),
          toSpot: new go.Spot(0, 0.35)
        },
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'color', (c: any) => go.Brush.darkenBy(c, 0.3))
        )
      )
    );

    diagram.nodeTemplateMap.add('pump',
      $(go.Node, 'Spot', {
        locationSpot: new go.Spot(0.5, 1, 0, -21),
        locationObjectName: 'SHAPE',
        selectionObjectName: 'SHAPE',
        rotatable: true,
        doubleClick: (e: go.InputEvent, obj: go.GraphObject) => {
          const node = obj.part as go.Node;
          if (node) this.openModal(node.data);
        },
        toolTip:
          $('ToolTip',
            $(go.TextBlock, { margin: 4 },
              new go.Binding('text', 'key', (key: any) => 'Pump: ' + key)
            )
          )
      },
        new go.Binding('angle').makeTwoWay(),
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, {
          name: 'SHAPE',
          geometryString: pump,
          width: 45,
          height: 45,
          strokeWidth: 2,
          portId: '',
          fromSpot: new go.Spot(1, 0.25),
          toSpot: new go.Spot(0, 0.5)
        },
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'color', (c: any) => go.Brush.darkenBy(c, 0.3))
        ),
        $(go.TextBlock, {
          alignment: go.Spot.Center,
          textAlign: 'center',
          margin: 2,
          editable: false,
          font: 'bold 10px InterVariable, sans-serif',
          stroke: colors.white
        },
          new go.Binding('text', 'key'),
          new go.Binding('angle', 'angle', (a: any) => a === 180 ? 180 : 0).ofObject()
        )
      )
    );

    const valuesTableItem = $(go.Panel, 'TableRow',
      $(go.TextBlock, '', { ...textDefaults }, new go.Binding('text', 'label')),
      $(go.Panel, 'Spot', { column: 1 },
        $(go.Shape, {
          stroke: colors.orange, fill: colors.black, margin: 2, width: 40, height: 15
        }),
        $(go.TextBlock, '', { ...textDefaults },
          new go.Binding('text', 'value')
        )
      ),
      $(go.TextBlock, '', { column: 2, alignment: go.Spot.Left, ...textDefaults },
        new go.Binding('text', 'unit')
      )
    );

    const valuesTable = $(go.Panel, 'Table', { itemTemplate: valuesTableItem },
      new go.Binding('itemArray', 'values')
    );

    const statusPanelTemplate = $(go.Panel, 'Spot',
      $(go.Shape, { width: 18, height: 18, fill: colors.white },
        new go.Binding('fill')
      ),
      $(go.TextBlock, '', { ...textDefaults },
        new go.Binding('text')
      )
    );

    const statusPanel = $(go.Panel, 'Horizontal', {
      width: 90, height: 20, itemTemplate: statusPanelTemplate
    },
      new go.Binding('itemArray', 'statuses')
    );

    diagram.nodeTemplateMap.add('monitor',
      $(go.Node, 'Auto',
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, { fill: colors.black, stroke: colors.white, strokeWidth: 2 }),
        $(go.Panel, 'Vertical', { margin: 4 },
          $(go.TextBlock, 'Title', { ...textDefaults }, new go.Binding('text', 'title')),
          statusPanel,
          valuesTable
        )
      )
    );

    diagram.nodeTemplateMap.add('sensor',
      $(go.Node, 'Vertical',
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Horizontal', { margin: 4 },
          $(go.Shape, { fill: colors.black, stroke: colors.white, strokeWidth: 2, geometryString: sensor, portId: '', fromSpot: new go.Spot(0, 0.4, 0, 0) }),
          $(go.TextBlock, '', { margin: 2, ...textDefaults }, new go.Binding('text', 'key'))
        ),
        $(go.Panel, 'Horizontal',
          $(go.Panel, 'Spot', { column: 1 },
            $(go.Shape, { stroke: colors.orange, fill: colors.black, margin: 2, width: 40, height: 15 }),
            $(go.TextBlock, '', { ...textDefaults }, new go.Binding('text', 'value'))
          ),
          $(go.TextBlock, '', { column: 2, alignment: go.Spot.Left, ...textDefaults }, new go.Binding('text', 'unit'))
        )
      )
    );

    diagram.linkTemplateMap.add('',
      $(go.Link, {
        routing: go.Routing.AvoidsNodes,
        corner: 12,
        layerName: 'Background',
        toShortLength: 3,
        doubleClick: (e: go.InputEvent, obj: go.GraphObject) => {
          const link = obj.part as go.Link;
          if (link) this.openModal(link.data);
        }
      },
        new go.Binding('fromEndSegmentLength', 'fromEndSeg'),
        new go.Binding('toEndSegmentLength', 'toEndSeg'),
        $(go.Shape, { strokeWidth: 8, stroke: colors.black, isPanelMain: true }),
        $(go.Shape, { strokeWidth: 3.5, stroke: colors.green, isPanelMain: true },
          new go.Binding('stroke', 'color')
        ),
        $(go.Shape, { isPanelMain: true, stroke: 'white', strokeWidth: 1.5, strokeDashArray: [10, 10], name: 'FLOW', opacity: 0.9 }),
        $(go.Shape, { stroke: colors.green, fill: colors.green, toArrow: 'Triangle' },
          new go.Binding('stroke', 'color'),
          new go.Binding('fill', 'color')
        ),
        $(go.Panel, 'Auto', { visible: false },
          new go.Binding('visible', 'text', (t: any) => true),
          $(go.Shape, 'RoundedRectangle', { strokeWidth: 1, fill: colors.gray }),
          $(go.TextBlock, { margin: new go.Margin(3, 1, 1, 1), ...textDefaults },
            new go.Binding('text')
          )
        )
      )
    );

    diagram.linkTemplateMap.add('monitor',
      $(go.Link, { curve: go.Curve.Bezier, layerName: 'Background', fromSpot: go.Spot.Top, fromEndSegmentLength: 30 },
        new go.Binding('fromSpot', 'fs'),
        new go.Binding('toSpot', 'ts'),
        $(go.Shape, {
          strokeWidth: 3,
          stroke: colors.white,
          strokeDashArray: [3, 4],
          name: 'FLOW',
          isPanelMain: true
        },
          new go.Binding('stroke', 'color')
        )
      )
    );

    diagram.linkTemplateMap.add('sensor',
      $(go.Link, { layerName: 'Background' },
        $(go.Shape, { strokeWidth: 1.5, stroke: colors.red, strokeDashArray: [2, 2], name: 'FLOW' })
      )
    );

    diagram.nodeTemplateMap.add('Equipment',
      $(go.Node, 'Spot',
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Spot',
          $(go.Shape, 'RoundedRectangle', {
            fill: colors.gray, stroke: colors.white, strokeWidth: 2, width: 90, height: 160
          },
            new go.Binding('fill', 'color')
          ),
          $(go.TextBlock, {
            font: 'bold 12px InterVariable, sans-serif',
            stroke: colors.white,
            textAlign: 'center'
          },
            new go.Binding('text')
          )
        ),
        new go.Binding('itemArray', 'ports'),
        {
          itemTemplate: $(go.Panel,
            new go.Binding('alignment', 'spot', go.Spot.parse),
            new go.Binding('portId', 'portId'),
            $(go.Shape, 'Circle', { width: 8, height: 8, fill: colors.red, stroke: null })
          )
        }
      )
    );

    const animate = () => {
      setTimeout(() => {
        const oldskip = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true;
        diagram.links.each((link: go.Link) => {
          const shape = link.findObject('FLOW') as go.Shape;
          if (shape) {
            const off = shape.strokeDashOffset - 0.5;
            shape.strokeDashOffset = (off <= 0) ? 20 : off;
          }
        });
        diagram.skipsUndoManager = oldskip;
        animate();
      }, 35);
    };
    animate();

    return diagram;
  }

  public initData() {
    this.diagramNodeData = this.diagramService.getCurrentNodeData();
    this.diagramLinkData = this.diagramService.getCurrentLinkData();
    this.cdr.detectChanges();
  }

  private simulateData() {
    // Generate new data
    const newNd = [...this.diagramNodeData];
    let changed = false;

    // simulation logic for sensors
    newNd.forEach((d: any) => {
      if (d.key === 'S1' || d.key === 'S2') {
        d.value = this.roundAndFloor(parseFloat(d.value) + this.random(-0.5, 0.55), 1).toString();
        changed = true;
      }

      if (+new Date() % 2 === 0) return; // run 50%
      if (d.key === 'cTCV102' || d.key === 'cFCV101' || d.key === 'cFM102' || d.key === 'cFM103') {
        d.values[0].value = this.roundAndFloor(parseFloat(d.values[0].value) + this.random(-0.5, 0.55), 1).toString();
        d.values[1].value = this.roundAndFloor(parseFloat(d.values[1].value) + this.random(-0.3, 0.35), 1).toString();
        d.values[2].value = this.roundAndFloor(parseFloat(d.values[2].value) + this.random(-0.2, 0.2), 1).toString();
        changed = true;
      }

      if (+new Date() % 15 === 0) return;
      if (d.key === 'cTCV102' || d.key === 'cFCV101' || d.key === 'cFM102' || d.key === 'cFM103') {
        d.statuses[0].fill = Math.random() > 0.5 ? '#7ba961' : '#ffffff';
        d.statuses[1].fill = Math.random() > 0.5 ? '#f9c66a' : '#ffffff';
        changed = true;
      }
    });

    if (changed) {
      this.skipsDiagramUpdate = false;
      this.diagramNodeData = newNd;
      this.diagramLinkData = [...this.diagramLinkData];
      this.cdr.detectChanges(); // force change detection since array is copies
    }

  }

  private roundAndFloor(num: number, decimalPlaces = 0): number {
    let internalNum: any = Math.round(Number((num as any) + 'e' + decimalPlaces));
    return Math.max(Number(internalNum + 'e' + -decimalPlaces), 0);
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public onModelChange(event: any) { }

  public changeLinkColors() {
    const colors = {
      red: '#ed2d44',
      yellow: '#f9c66a',
      green: '#7ba961'
    };

    const newLd = this.diagramLinkData.map((d: any) => {
      const newD = { ...d };
      if (newD.color === colors.green) {
        newD.color = Math.random() > 0.5 ? colors.red : colors.yellow;
      }
      return newD;
    });

    this.diagramLinkData = newLd;
    this.skipsDiagramUpdate = false;
    this.cdr.detectChanges();
  }

  public resetLinkColors() {
    const colors = { green: '#7ba961' };

    const newLd = this.diagramLinkData.map((d: any) => {
      const newD = { ...d };
      if (!newD.category || newD.category !== 'sensor' && newD.category !== 'monitor') {
        newD.color = colors.green;
      }
      return newD;
    });

    this.diagramLinkData = newLd;
    this.skipsDiagramUpdate = false;
    this.cdr.detectChanges();
  }

  public changeNodeColors() {
    const pallete = [colors.red, colors.yellow, colors.green];
    const newNd = this.diagramNodeData.map((d: any) => {
      const newD = { ...d };
      if (!newD.category || newD.category === 'Equipment' || newD.category === 'tank') {
        newD.color = pallete[Math.floor(Math.random() * pallete.length)];
      }
      return newD;
    });

    this.diagramNodeData = newNd;
    this.skipsDiagramUpdate = false;
    this.cdr.detectChanges();
  }

  public resetNodeColors() {
    const newNd = this.diagramNodeData.map((d: any) => {
      const newD = { ...d };
      if (!newD.category || newD.category === 'Equipment') {
        newD.color = colors.white;
      }
      return newD;
    });

    this.diagramNodeData = newNd;
    this.skipsDiagramUpdate = false;
    this.cdr.detectChanges();
  }

  public openModal(data: any) {
    this.selectedNodeData = data;
    this.cdr.detectChanges(); // Ensure Angular updates view
    const modal = document.getElementById('nodeModal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  public closeModal() {
    this.selectedNodeData = null;
    const modal = document.getElementById('nodeModal') as HTMLDialogElement;
    if (modal) modal.close();
  }
}
