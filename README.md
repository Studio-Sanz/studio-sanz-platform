# Buildings Real Estate CMS

A complete CMS for managing real estate properties with Next.js, Prisma, PostgreSQL, and Cloudinary.

## Features

- **Admin Dashboard** (`/admin`)
  - Buildings management
  - Full CRUD operations
  - Image/video uploads via Cloudinary
  - Interactive facade points
  - Amenities management
  - PDF brochure uploads

- **Public Pages** (`/build/[slug]`)
  - Responsive building showcase
  - Video hero section
  - Interactive facade with hotspots
  - Amenities gallery
  - Contact information
  - Location map integration ready

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Docker)
- **ORM:** Prisma 7
- **File Storage:** Cloudinary
- **Fonts:** Geist Sans & Geist Mono
- **Containerization:** Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Cloudinary account

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Cloudinary credentials from [console.cloudinary.com](https://console.cloudinary.com/)

3. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d postgres
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Admin: http://localhost:3000/admin
   - Public pages: http://localhost:3000/build/[slug]

## Cloudinary Setup

⚠️ **IMPORTANT:** You need to create an upload preset in Cloudinary:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to Settings → Upload
3. Scroll down to "Upload presets"
4. Click "Add upload preset"
5. Set the preset name to: `buildings`
6. Set "Signing Mode" to: **Unsigned**
7. Save the preset

## Database Schema

### Building
- Basic info (name, slug, logo, main image)
- Location (lat/long, address)
- Contact (phone, whatsapp, email, website)
- Media (initial video, facade image, brochure)
- Relations (facade points, amenities)

### FacadePoint
- Interactive points on facade images
- Support for 3D tours (Kuula)
- Floor plan images
- Positioned with X/Y coordinates (percentage)

### Amenity
- Name and image
- Orderable list

## Usage

### Creating a Building

1. Navigate to `/admin/buildings`
2. Click "Create" button
3. Fill in:
   - Building Name (e.g., "Melia Miami Brickell")
   - Main Image (upload)
   - Logo (upload)
4. Click "Create Building"

### Editing Building Details

1. Click on a building card in `/admin/buildings`
2. Update any section:
   - **Main Information:** Image, logo, name, location, contact
   - **Initial Video:** Upload 5-second video (recommended)
   - **Facade Photo:** Upload and add interactive points
   - **Amenities:** Add multiple amenities with images
   - **Brochure:** Upload PDF

### Adding Facade Points

1. Upload a facade image
2. Click on the image where you want to add a point
3. Fill in the modal:
   - Point name
   - Photo
   - 3D tour URL (Kuula link)
   - Floor plan image
4. Points appear as red dots on the facade

## Docker Deployment

### Build and run with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- Next.js app (port 3000)

### Production deployment:

```bash
docker-compose -f docker-compose.yml up -d
```

## Project Structure

```
buildings-app/
├── app/
│   ├── admin/             # Admin dashboard
│   │   ├── buildings/     # Buildings management
│   │   │   ├── [id]/      # Building detail page
│   │   │   └── page.tsx   # Buildings list
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   └── page.tsx       # Dashboard home
│   ├── api/
│   │   └── buildings/     # API routes
│   ├── build/
│   │   └── [slug]/        # Public building pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/ui/         # shadcn/ui components
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── cloudinary.ts      # Cloudinary config
├── prisma/
│   └── schema.prisma      # Database schema
├── docker-compose.yml     # Docker services
├── Dockerfile             # Next.js container
└── .env                   # Environment variables
```

## API Endpoints

- `GET /api/buildings` - List all buildings
- `POST /api/buildings` - Create a building
- `GET /api/buildings/[id]` - Get building details
- `PATCH /api/buildings/[id]` - Update a building
- `DELETE /api/buildings/[id]` - Delete a building

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildings_db"

# Get these from your Cloudinary dashboard (https://console.cloudinary.com/)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_URL="cloudinary://your_api_key:your_api_secret@your_cloud_name"

# Client-side (exposed to browser)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

## Features to Implement

- [ ] Complete facade points API endpoints
- [ ] Complete amenities API endpoints
- [ ] Map integration (Google Maps / Mapbox)
- [ ] User authentication
- [ ] Image optimization
- [ ] SEO metadata
- [ ] Analytics integration

## License

MIT
