# 📋 Task Management Dashboard

A **production-quality**, fully-featured Task Management Dashboard built with modern web technologies. This application provides a complete task lifecycle management experience with a premium, responsive UI that works beautifully across all devices.

---

## ✨ Features

### Core Features
- **🔐 Mock Authentication** — Login with any valid email/password, session persisted in localStorage
- **📊 Interactive Dashboard** — Real-time statistics, progress tracking, and task analytics
- **✅ Full CRUD Operations** — Create, Read, Update, and Delete tasks with instant feedback
- **🔍 Real-time Search** — Case-insensitive search by task title with instant filtering
- **🏷️ Status Filtering** — Filter tasks by All, Todo, In Progress, or Completed
- **📅 Date Sorting** — Sort tasks by due date (Newest First / Oldest First)
- **📄 Client-side Pagination** — 5 tasks per page with page indicators and navigation

### Bonus Features
- **🌗 Dark Mode** — System-aware theme toggle with localStorage persistence
- **🎨 Premium UI** — Glassmorphism, micro-animations, gradient accents, and smooth transitions
- **📱 Responsive Design** — Desktop table view + mobile card view with adaptive layouts
- **🔔 Toast Notifications** — Animated success/error/warning/info feedback system
- **🧪 Unit Tests** — Jest + React Testing Library test suites for creation and filtering
- **🗂️ Empty State UI** — Beautiful empty states with actionable reset options
- **⏳ Loading States** — Animated skeleton-style loaders during data retrieval
- **⚠️ Overdue Detection** — Visual indicators for tasks past their due date

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Custom shadcn/ui-inspired components |
| **Form Handling** | React Hook Form |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **State** | React Context + localStorage |
| **API** | Next.js Route Handlers (Mock) |
| **Testing** | Jest + React Testing Library |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Auto-redirect to dashboard/login
│   ├── globals.css             # Design system & animations
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Protected dashboard page
│   └── api/
│       └── tasks/
│           ├── route.ts        # GET / POST handlers
│           └── [id]/
│               └── route.ts    # PUT / DELETE handlers
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx      # Zod-validated login form
│   │   └── protected-route.tsx # Client-side route guard
│   ├── dashboard/
│   │   ├── dashboard-header.tsx# Header with theme toggle & logout
│   │   ├── stats-summary.tsx   # Task statistics cards
│   │   └── task-filters.tsx    # Search, filter, sort controls
│   ├── tasks/
│   │   ├── task-dialog.tsx     # Create/Edit task modal
│   │   ├── task-table.tsx      # Desktop table view
│   │   ├── task-card.tsx       # Mobile card view
│   │   ├── task-delete-dialog.tsx # Delete confirmation
│   │   └── task-pagination.tsx # Pagination controls
│   └── ui/
│       ├── button.tsx          # Multi-variant button
│       ├── input.tsx           # Styled text input
│       ├── textarea.tsx        # Styled textarea
│       ├── badge.tsx           # Status badges
│       ├── select.tsx          # Custom dropdown
│       ├── dialog.tsx          # Modal dialog system
│       └── toast.tsx           # Notification system
│
├── hooks/
│   ├── use-auth.ts             # Authentication hook
│   └── use-tasks.ts            # Offline-first task management
│
├── lib/
│   ├── api.ts                  # API fetch client
│   ├── mockDb.ts               # Server-side mock database
│   └── utils.ts                # Class name utilities
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── utils/
│   └── sample-data.ts          # 10 sample task generator
│
├── providers/
│   ├── auth-provider.tsx       # Auth context provider
│   └── theme-provider.tsx      # Theme context provider
│
└── __tests__/
    ├── task-creation.test.tsx   # Task creation unit test
    └── task-filtering.test.tsx  # Task filtering unit test
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18.17+ 
- **npm** 9+

### Steps

```bash
# 1. Clone or navigate to the project directory
cd Task_manager

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

---

## 📖 Running Locally

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run unit tests
npm test

# Run linting
npm run lint
```

---

## 🎨 Design Decisions

### Architecture: Offline-First Synchronization
The application uses an **Offline-First** data strategy:
1. All read/write operations execute instantly against `localStorage` for zero-latency UI updates
2. API calls to Next.js Route Handlers run simultaneously in the background
3. This architecture simulates real-world optimistic UI patterns and can be migrated to a real backend by simply swapping the API endpoints

### Authentication: Client-Side Guards
Since `localStorage` is only accessible in the browser context (not in Edge Middleware), route protection is enforced using a `ProtectedRoute` wrapper component that checks auth state on mount.

### Component Design: Custom UI Primitives
All UI components (Button, Dialog, Badge, Toast, etc.) are built from scratch following shadcn/ui patterns — providing full control over styling, animations, and accessibility without external component library dependencies.

### Theme System: HSL Design Tokens
Colors are defined as HSL triplets in CSS custom properties, mapped through Tailwind's `@theme` directive. This enables seamless dark/light mode transitions with a single class toggle.

### Responsive Strategy: Table ↔ Card Reflow
- **Desktop** (md+): Rich data table with inline status dropdowns and action buttons
- **Mobile** (<md): Stacked card layout with touch-friendly controls
- Both views share identical data and action handlers

---

## 🔮 Future Improvements

- [ ] Real backend integration (Prisma + PostgreSQL)
- [ ] Drag-and-drop Kanban board view
- [ ] Task priority levels (Low, Medium, High, Critical)
- [ ] Subtasks and checklists
- [ ] File attachments
- [ ] Team collaboration and task assignment
- [ ] Real-time updates via WebSockets
- [ ] Calendar view integration
- [ ] Task comments and activity log
- [ ] Export to CSV/PDF
- [ ] E2E tests with Playwright

---

## 📸 Screenshots

> Screenshots can be added here after running the application locally.

| View | Description |
|---|---|
| Login Page | Glassmorphism card with animated grid background |
| Dashboard (Light) | Statistics, table view, pagination |
| Dashboard (Dark) | Full dark mode with smooth transitions |
| Mobile View | Responsive card-based task layout |
| Task Dialog | Create/Edit form with Zod validation |
| Delete Confirmation | Alert dialog with destructive action |

---

## 📄 License

This project is for demonstration and educational purposes.

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS.
