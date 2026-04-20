import * as go from 'gojs';

export const colors = {
  black: '#151c26',
  white: '#ffffff',
  gray: '#2c323b',
  green: '#7ba961',
  blue: '#00a9b0',
  pink: '#e483a2',
  yellow: '#f9c66a',
  orange: '#e48042',
  red: '#ed2d44',
};

export const tank1 = 'F M 0 0 L 0 75 25 100 50 75 50 0z';
export const labelLeft = 'F M 0 20 L 30 40 100 40 100 0 30 0 z';
export const labelRight = 'F M 0 0 L 70 0 100 20 70 40 0 40 z';
export const valve = 'F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30';
export const pump = 'F M 10 0 A 10 10 0 1 1 10 20 A 10 10 0 1 1 10 0 Z';
export const sensor = 'F M 0 0 L 15 15 L 15 20 L 5 20 L 5 15 L 0 15 L 0 10 L -2 10 L -2 4 L 0 4 Z';

export const tank3 = 'F M 0 15 A 25 15 0 0 1 50 15 L 50 135 A 25 15 0 0 1 0 135 z M 0 20 L 50 20 M 0 30 L 50 30 M 0 30 L 12.5 20 L 25 30 L 37.5 20 L 50 30 M 0 20 L 12.5 30 L 25 20 L 37.5 30 L 50 20 M 0 45 L 50 45 M 0 75 L 50 75 M 0 45 L 50 75 M 0 75 L 50 45 M 0 100 L 20 100 L 20 90 L 30 90 L 30 100 L 50 100 M 0 120 L 50 120 M 0 130 L 50 130 M 0 130 L 12.5 120 L 25 130 L 37.5 120 L 50 130 M 0 120 L 12.5 130 L 25 120 L 37.5 130 L 50 120'; // Tall contactor vessel shape
export const tank2 = 'F M 0 0 L 0 100 10 100 10 90 40 90 40 100 50 100 50 0z';
export const equipment = 'F M 0 15 A 25 10 0 0 1 50 15 L 50 85 A 25 10 0 0 1 0 85 z M 0 25 L 50 25 M 0 35 L 50 35 M 0 35 L 12.5 25 L 25 35 L 37.5 25 L 50 35 M 0 25 L 12.5 35 L 25 25 L 37.5 35 L 50 25';

export const DIAGRAM_NODE_DATA = [
  // LABELS
  { key: '1', category: 'label', text: 'UFD-2105', subText: 'LEAN GLYCOL FROM GLYCOL REGENRATION', color: colors.white, direction: 'left', pos: '0 0' },
  { key: '2', category: 'label', text: 'From LP Steam\nHeader', subText: 'Ext. Info', color: colors.white, pos: '0 160' },
  { key: '3', category: 'label', text: 'Soft Water', subText: 'Ext. Info', color: colors.white, pos: '80 240' },
  { key: '4', category: 'label', text: 'From C-2220A', subText: 'Ext. Info', color: colors.white, pos: '0 299.5' },
  { key: '5', category: 'label', text: 'To MRF-02', subText: 'Ext. Info', color: colors.white, direction: 'left', pos: '0 360.5' },
  { key: '6', category: 'label', text: 'Crude\nFrom Storage Tank', subText: 'Ext. Info', color: colors.white, pos: '0 423' },
  { key: '7', category: 'label', text: 'To MCOT', subText: 'Ext. Info', color: colors.white, direction: 'left', pos: '0 500' },
  // TANKS
  {
    key: 'V-2050',
    tankType: tank3,
    color: colors.white,
    pos: '287 19',
    ports: [
      { p: 'BL1', a: "0 1 0 -50" },
      { p: 'BL2', a: "0 1 0 -30" },
      { p: 'BL3', a: "0 1 0 -10" },
      { p: 'BR', fs: "Right", a: "1 1 0 -30" },
      {
        p: 'SensorR',
        type: 'sensor',
        ts: "Right",
        a: "1 0.5 0 0",
      },
    ],
  },
  {
    key: 'MSF',
    color: colors.white,
    pos: '300 350',
    ports: [
      { p: 'TL', a: "0 0 0 30" },
      { p: 'BR', a: "1 1 0 -50", fs: "Right" },
      { p: 'B', a: "0.5 1 0 0" },
    ],
  },
  {
    key: 'C-2220',
    color: colors.white,
    tankType: equipment,
    pos: '650 261',
    width: 70,
    height: 120,
    ports: [
      { p: 'TL', a: "0 0 0 30" },
      { p: 'BL', a: "0 1 0 -30" },
      { p: 'TR', fs: "Right", a: "1 0 0 30" },
      { p: 'BR', ts: "Right", a: "1 1 0 -30" },
    ],
  },

  {
    key: 'MPAT',
    color: colors.white,
    pos: '865 30',
    ports: [{ p: 'L', a: "0 0.5 0 0", fs: "Left" }],
  },

  // VALVES
  { key: 'TCV102', category: 'valve', color: colors.white, pos: '197 130' },
  { key: 'FCV101', category: 'valve', color: colors.white, pos: '600 450' },
  { key: 'FM102', category: 'valve', color: colors.white, pos: '508 167' },
  { key: 'FM103', category: 'valve', color: colors.white, pos: '706 184', angle: 180 },
  { key: 'FIC101', category: 'valve', color: colors.white, pos: '500 450' },
  { key: 'P03', category: 'pump', color: colors.yellow, pos: '429 178' },
  { key: 'P04', category: 'pump', color: colors.pink, pos: '800 173.5', angle: 180 },
];

let rawDiagramLinkData = [
  { from: 'V-2050', to: '1', text: 'LPS', color: colors.red, fromPort: 'BL1' },
  { from: '2', to: 'TCV102', text: 'SC', color: colors.green },
  { from: 'TCV102', to: 'V-2050', color: colors.green, toPort: 'BL2' },
  { from: '3', to: 'V-2050', toPort: 'BL3' },
  { from: '4', to: 'C-2220', text: 'DO', toPort: 'TL', color: colors.green },
  { from: 'FM103', to: 'C-2220', color: colors.green },
  { from: 'FM102', to: 'C-2220', toPort: 'TR', color: colors.green },
  { from: '5', to: 'C-2220', text: 'DO', toPort: 'BL', color: colors.green },
  { from: '6', to: 'MSF', text: 'CPO', color: colors.green, toPort: 'TL' },
  { from: 'MSF', to: '7', text: 'CPO', color: colors.green, fromPort: 'B' },
  { from: 'LCV101', to: '8', text: 'CPO', color: colors.green },
  { from: 'MSF', to: 'FIC101', fromPort: 'BR' },
  { from: 'FIC101', to: 'FCV101' },
  { from: 'FCV101', to: 'C-2220', toPort: 'BR' },
  { from: 'V-2050', to: 'P03', color: colors.green, fromPort: 'BR' },
  { from: 'P03', to: 'FM102', color: colors.red },
  { from: 'MPAT', to: 'P04', color: colors.yellow, fromPort: 'L' },
  { from: 'P04', to: 'FM103', color: colors.green },
  { from: 'P102', to: 'LCV101' },
];

let linkIdx = -1;
export const DIAGRAM_LINK_DATA = rawDiagramLinkData.map((d: any) => ({ ...d, key: linkIdx-- }));
