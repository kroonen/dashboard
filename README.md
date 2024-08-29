# Productivity Dashboard


**Demo :** https://kroonen.github.io/dashboard/


A versatile and customizable productivity dashboard that runs entirely in your browser. Manage tasks, take notes, organize your workflow with a Kanban board, and more - all in one place.

## Motivation

I created this project because I wasn't satisfied with the current solutions and apps available for use as a dashboard to organize my life. Many existing tools either lacked the features I needed, were overly complex, or raised privacy concerns. This Productivity Dashboard aims to provide a comprehensive yet user-friendly solution that respects your privacy.

## Privacy and Data Storage

This application is designed with privacy in mind:

- It is entirely private as all data stays in the cache of your browser.
- The app is completely static, with no server-side processing or external data storage.
- You have full control over your data. You can export it for backup and import it as needed through the Settings panel.

## Features

- **Multiple Dashboards**: Create and switch between various dashboards for different projects or aspects of your life.
- **Task Management**: Add, edit, and remove tasks easily.
- **Quick Notes**: Jot down ideas and important information.
- **Kanban Board**: Visualize and manage your workflow with a drag-and-drop Kanban board.
- **Customizable Cards**: Create, resize, and reposition cards on your dashboard.
- **Persistent Storage**: All your data is saved locally in your browser.
- **Custom Wallpaper**: Personalize your dashboard with your own background image.
- **Data Import/Export**: Backup and restore your data easily.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Python 2.7+ or Python 3.x (for running a local server)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/productivity-dashboard.git
   ```

2. Navigate to the project directory:
   ```
   cd productivity-dashboard
   ```

3. Run a local server:

   - If you're using Python 2.7+:
     ```
     python -m SimpleHTTPServer 8000
     ```

   - If you're using Python 3.x:
     ```
     python -m http.server 8000
     ```

4. Open your web browser and go to `http://localhost:8000`

The app should now be running locally on your machine.

Note: Keep the terminal/command prompt window open while using the app, as closing it will shut down the local server.

## Usage

- **Adding a New Dashboard**: Click the '+' button in the tab bar.
- **Adding a New Card**: Click the '+' button in the bottom right corner of the dashboard.
- **Managing Tasks**: Use the "Tasks" card to add, edit, or remove tasks.
- **Taking Notes**: Use the "Quick Notes" card for jotting down information.
- **Using the Kanban Board**: Switch to the Kanban tab and drag tasks between columns.
- **Customizing Wallpaper**: Go to the Settings tab and click "Change Wallpaper".
- **Saving Data**: Your data is automatically saved. You can also use Ctrl+S (Cmd+S on Mac) to save manually.
- **Importing/Exporting Data**: Use the respective buttons in the Settings tab to backup or restore your data.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
