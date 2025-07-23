# Book Scraper Frontend

A modern Vue.js frontend for the Book Scraper application with a beautiful dark mode interface and responsive design.

## 🎨 Features

- **Dark Mode Design**: Beautiful dark theme with blue accent colors
- **Responsive Layout**: Mobile-first design that works on all devices
- **Real-time Notifications**: Toast notifications for user feedback
- **Search & Filter**: Advanced search and sorting capabilities
- **Pagination**: Efficient pagination for large datasets
- **Export Functionality**: CSV export for book collections
- **Loading States**: Smooth loading animations and states

## 🛠️ Tech Stack

- **Vue 3**: Latest Vue.js with Composition API
- **Vue Router 4**: Client-side routing
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and dev server

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on port 3001

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 Routes

### 1. Home/Scrape Route (`/`)

- **Purpose**: Main interface for URL input and scraping
- **Features**:
  - URL input with validation
  - Group name input
  - Real-time scraping with loading states
  - Recent activity tracking
  - Tips and best practices

### 2. Groups List Route (`/groups`)

- **Purpose**: Display all book groups with pagination
- **Features**:
  - Search and filter groups
  - Sort by name, date, or book count
  - Responsive grid layout
  - Quick navigation to group details

### 3. Group Details Route (`/groups/:id`)

- **Purpose**: Display all books in a specific group
- **Features**:
  - Book grid with cover images
  - Search and filter books
  - Export to CSV functionality
  - Pagination for large collections

## 🎨 Design System

### Color Palette

- **Primary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Background**: Dark slate (`#020617` to `#0f172a`)
- **Surface**: Dark cards (`#1e293b` to `#334155`)
- **Text**: Light gray (`#f1f5f9` to `#94a3b8`)
- **Success**: Green (`#22c55e`)
- **Error**: Red (`#ef4444`)

### Components

#### Buttons

- `.btn-primary`: Primary action buttons
- `.btn-secondary`: Secondary action buttons
- `.btn-outline`: Outline style buttons

#### Forms

- `.input-field`: Styled input fields with focus states
- Form validation with real-time feedback

#### Cards

- `.card`: Standard card component
- `.card-hover`: Interactive card with hover effects

#### Loading States

- Custom loading spinner with text
- Skeleton loading for content

## 🔧 Configuration

### Environment Variables

The frontend is configured to proxy API requests to the backend server. The proxy is configured in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

### API Integration

The frontend communicates with the backend through the `ApiService`:

- **Scrape Books**: `POST /api/scrape-data`
- **Get Groups**: `GET /api/groups`
- **Get Group Books**: `GET /api/groups/:id/books`

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single column layout, collapsible navigation
- **Tablet**: Two-column grid for books, expanded navigation
- **Desktop**: Multi-column grids, full navigation bar

### Breakpoints

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 🎯 User Experience

### Loading States

- Skeleton loading for content
- Spinner animations for actions
- Progressive loading for images

### Notifications

- Success notifications for completed actions
- Error notifications with helpful messages
- Auto-dismissing toasts

### Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast design
- Focus indicators

## 🔍 Search & Filter

### Groups Page

- Search by group name
- Sort by creation date, name, or book count
- Real-time filtering

### Books Page

- Search by title or edition
- Sort by date added, title, or edition
- Client-side pagination

## 📊 Export Functionality

Users can export book collections to CSV format:

- Includes all book information
- Properly formatted for spreadsheet applications
- Automatic file naming with group name

## 🚀 Performance

- **Lazy Loading**: Images load progressively
- **Code Splitting**: Route-based code splitting
- **Optimized Builds**: Vite for fast development and builds
- **Caching**: API response caching where appropriate

## 🛡️ Error Handling

- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Real-time form validation
- **404 Pages**: Custom error pages for missing routes
- **Fallback States**: Empty states for no data

## 📝 Development

### Project Structure

```
client/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/         # Page components
│   ├── router/        # Vue Router configuration
│   ├── store/         # Pinia stores
│   ├── services/      # API services
│   ├── style.css      # Global styles
│   ├── main.js        # App entry point
│   └── App.vue        # Root component
├── public/            # Static assets
├── index.html         # HTML template
└── package.json       # Dependencies
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code with ESLint

## 🎨 Customization

### Styling

The design system is built with Tailwind CSS and can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Custom primary colors */ },
      dark: { /* Custom dark theme colors */ }
    }
  }
}
```

### Components

All components are built with Vue 3 Composition API and can be easily modified or extended.

## 📞 Support

For issues or questions:

1. Check the backend server is running
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Ensure all dependencies are installed

## 📄 License

MIT License - see LICENSE file for details
