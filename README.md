# BioNinja Physics

An interactive, high-yield physics learning environment inspired by the structure and clarity of BioNinja.

## Features

- **Structured Syllabus Tree**: Complete hierarchical curriculum taxonomy (IB Physics, AP Physics C, A-Level) with SL & HL filtering, formulas, and examiner takeaways.
- **Interactive Visual Laboratory**: 2D kinematics projectile simulation with live vector decompositions ($V_x$, $V_y$, $|V|$), parameter scrubbers, and gravitational field presets (Earth, Moon, Mars).
- **Formula Data Booklet**: Searchable formula reference index across mechanics, waves, electromagnetism, and quantum physics.
- **Supabase Integration**: Pre-configured database client with public and service-role helpers.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Raheeq-lab/bioninja-physics.git
   cd bioninja-physics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase (`@supabase/supabase-js`)
- **Icons**: Lucide React
