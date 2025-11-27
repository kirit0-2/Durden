# Dual-Persona Chat

A mobile-first, Black & White chat application where you play both sides. Built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- **Dual Personas**: Roleplay as Persona A ("Me") and Persona B ("Alter").
- **Strict B&W Theme**: No colors, just grayscale.
- **Mobile-First**: Optimized for mobile usage with keyboard handling.
- **Persistence**: All data stored in LocalStorage.
- **Image Uploads**: Upload avatars (stored locally).

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS (v4)
- shadcn/ui (Radix Primitives)
- LocalStorage for persistence

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

- **Manual**: Open the app, create a conversation, switch personas, send messages, upload avatars.
- **Lint**: `npm run lint`

## Notes

- **Keyboard Handling**: Uses `visualViewport` API to detect keyboard on mobile and adjust the input layout.
- **Storage**: Images are compressed to <300KB to fit in LocalStorage. If storage is full, an alert will appear.
