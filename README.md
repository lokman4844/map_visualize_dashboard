# MyInspect - Integrity Status Visualization (PoC)

MyInspect is a modern, web-based Proof of Concept (PoC) designed for industrial monitoring and integrity status visualization. It combines high-fidelity SCADA diagrams with geographic asset tracking to provide a comprehensive overview of offshore operations.

## 🚀 Features

### 1. Industrial Monitor (Dashboard)
- **Live SCADA Visualization**: Interactive diagram built with **GoJS** showing real-time flow and equipment status.
* **Interactive Modals**: Double-click any equipment (Tanks, Pumps, Valves) to view detailed integrity data and status reports.
- **Dynamic Data Simulation**: Built-in state simulation to demonstrate live monitoring capabilities.

### 2. Drawing Editor (Buggy atm)
- **Customizable Layout**: Rearrange the SCADA diagram to match actual site configurations.
- **Persistence**: Changes made in the editor are saved to `localStorage` and automatically synchronize with the primary Monitor view.
- **Industrial Templates**: Standardized shapes for industrial assets (Contactor Columns, Vessels, Separators).

### 3. Map Overview
- **Geographic Asset Tracking**: Integration with **OpenStreetMap** to visualize assets in their global context.
- **Specific Asset Targeting**: Pre-configured view centered on the **SK311 Block (South Acis Platform)** offshore Sarawak.
- **Satellite Integration**: High-resolution satellite tiles for realistic offshore visualization.

## 🛠️ Tech Stack

- **Framework**: [Angular](https://angular.dev/) (Standalone Components)
- **Diagramming**: [GoJS](https://gojs.net/)
- **Mapping**: [@angular/google-maps](https://github.com/angular/components/tree/main/src/google-maps)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: Angular Services with RxJS Observables

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Angular CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the following command to start the development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/` to view the application.


## 📂 Project Structure

- `src/app/industrial-monitor`: Core SCADA visualization logic and data.
- `src/app/drawing-editor`: Interactive diagram editing tools.
- `src/app/map-overview`: Geographic visualization component.
- `src/app/services`: Shared state and data synchronization services.
- `src/app/layout`: Reusable UI components (Header, Sidebar).
