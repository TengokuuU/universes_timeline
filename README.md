# 🌌 Multiversum Timeline
An interactive, cinematic web application built with Angular designed to showcase the chronological order of the world's most iconic pop-culture universes: Marvel Cinematic Universe, Star Wars, and Five Nights at Freddy's.
## ✨ Key Features
**Dynamic Horizontal Timeline**: Navigate through franchise histories with a smooth, scrollable timeline interface.

**Contextual Themes**: The UI intelligently adapts its color palette (Marvel Red, Star Wars Yellow, FNaF Purple) and background images based on the selected universe.

**Interactive Hover Cards**: Hover over posters to reveal plot summaries, release dates, and direct links to streaming platforms or stores.

**Progress Tracking**: Mark movies or games as "watched/played" by clicking the poster. Your progress is saved locally using localStorage.

**Immersive Visuals**: High-quality background transitions (fade-in/out) that change based on the specific title you are exploring.

## 🚀 Installation & Setup
Before running the project, ensure you have Node.js installed on your system.

### Install Angular CLI
If you don't have the Angular CLI installed globally yet, run:

```bash
npm install -g @angular/cli
```
### Install Project Dependencies
Navigate to the project folder and install the required packages:

```bash
npm install
```
### Run the Project
Launch the development server:
```bash
ng serve -o
```

## 📁 Project Structure

**src/app/core/services/** — Contains the logic for fetching and switching between universe datasets.

**src/app/models/** — TypeScript interfaces (like *MCUItem*) defining the data shape.

**src/app/app.css** — Most of the styling, including theme definitions and hover animations.

## 🛠️Tech Stack
**Framework**: Angular 17+ (Standalone Architecture)

**Styling**: CSS3 with Dynamic Variable Injection (:root variables for theming)

**Data Management**: JSON-based data structures served via Angular Services.
