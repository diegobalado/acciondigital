# IMPLEMENTATION_TASKS.md

This file contains step-by-step implementation tasks for code agents.

Tasks are ordered by dependency.

---

# Phase 1 — Frontend Migration to Svelte

## Task 1

Create a new Svelte project using Vite.

Requirements:

- Vite
- Svelte
- basic project structure

---

## Task 2

Create main routes.

Required pages:


/events
/events/[slug]


Events page shows a list of available events.

---

## Task 3

Implement gallery page.

Requirements:

- load `page-1.json`
- render thumbnails
- support pagination

Example fetch:


/events/{slug}/index/page-1.json


---

## Task 4

Implement infinite scroll.

Behavior:

1. load page-1
2. render photos
3. when reaching bottom
4. load next JSON page
5. append photos

State variables:


currentPage
photos[]
loading


---

# Phase 2 — Event Ingestion Script

Create script:


process_event.php


Responsibilities:

- read folder of original photos
- generate thumbnails
- generate medium size
- extract bib from filename
- generate JSON index pages
- insert photo metadata into SQLite

---

## Task 5

Implement bib extraction function.

Input examples:


IMG_0342_bib145.jpg
145_0342.jpg


Output:


bib: 145
filename: 0342.jpg


---

## Task 6

Generate paginated JSON indexes.

Page size:


60 photos per page


Example file:


page-1.json


---

# Phase 3 — SQLite Integration

## Task 7

Create SQLite database.

Tables:


events
photos


Schema described in AGENTS.md.

---

## Task 8

Modify ingestion script to insert photo records.

For each photo:


event_id
filename
bib


---

## Task 9

Implement PHP endpoint.


GET /api/search


Parameters:


event
bib


Return list of filenames.

---

# Phase 4 — Migration to SvelteKit

## Task 10

Create new SvelteKit project.

Migrate Svelte components.

---

## Task 11

Implement search endpoint.

File:


src/routes/api/search/+server.ts


Use SQLite query.

---

# Phase 5 — Payments

## Task 12

Create orders table.

Fields:


id
event_id
photo_filename
email
status
created_at


---

## Task 13

Implement order creation endpoint.


POST /api/orders


---

## Task 14

Implement payment webhook handler.

Updates order status.

---

# Phase 6 — Storage Migration

## Task 15

Move images to object storage.

Example providers:

- Cloudflare R2
- S3

---

## Task 16

Update image URLs to CDN domain.

Example:


https://cdn.site.com/events/{slug}/thumb/{filename}


---

# Completion Criteria

The system is considered fully migrated when:

- frontend runs on SvelteKit
- search uses SQLite
- images served from CDN
- orders handled by Node backend