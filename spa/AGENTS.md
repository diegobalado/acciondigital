# AGENTS.md

## Project Overview

This repository contains a photo platform for sports events.

The system allows:

- browsing event photo galleries
- searching photos by bib number (dorsal)
- purchasing photos

The architecture is designed so that **most traffic is served as static files**, while the backend handles only dynamic operations.

Primary goals:

- extremely fast galleries
- minimal backend load
- scalable storage

---

# High Level Architecture

Static assets handle most traffic.


Frontend (Svelte / later SvelteKit)
|
Static JSON indexes
|
CDN / Object Storage
|
Images (thumb / medium / original)


Dynamic features:


Search by bib -> SQLite
Payments -> Node API
Orders -> database


Expected traffic distribution:

- 90–95% static (images + gallery indexes)
- 5–10% dynamic (search, payments)

---

# Current Migration Plan

The system is migrating through several phases:

Phase 1  
Frontend refactor to **Svelte** while backend remains **PHP**.

Phase 2  
Introduce **SQLite** for bib search.

Phase 3  
Migrate backend logic to **SvelteKit endpoints (Node)**.

Phase 4  
Integrate **payment system**.

Phase 5  
Move image storage to **object storage + CDN**.

---

# Photo Storage Structure

All event photos follow this structure:


/events
/{event-slug}
/thumb
/medium
/original
/index
page-1.json
page-2.json
page-3.json


Example:


/events/maraton-tandil-2026/thumb/0001.jpg
/events/maraton-tandil-2026/index/page-1.json


---

# JSON Index Format

Each page contains a list of images.

Example:

```json
{
  "page": 1,
  "photos": [
    {
      "filename": "0342.jpg",
      "bib": 145
    },
    {
      "filename": "0343.jpg",
      "bib": 212
    }
  ]
}

These indexes allow infinite scroll without querying a database.

Image URL Conventions

Thumbnail

/events/{slug}/thumb/{filename}

Medium

/events/{slug}/medium/{filename}

Original

/events/{slug}/original/{filename}
Bib Extraction

Bib numbers are encoded in the filename.

Examples:

IMG_0342_bib145.jpg
145_0342.jpg

The ingestion pipeline must extract:

bib
filename
Database Schema

SQLite is used only for search.

Table: events

id
slug
name
date

Table: photos

id
event_id
filename
bib

Index required:

CREATE INDEX idx_photos_bib
ON photos(bib);
API Endpoints

Search endpoint:

GET /api/search?event={slug}&bib={number}

Response:

[
  "0342.jpg",
  "0411.jpg",
  "0423.jpg"
]
Development Rules

When implementing features:

Prefer static solutions over dynamic queries.

Do not introduce server rendering for galleries.

Use JSON indexes for photo lists.

Database access is allowed only for:

search

orders

payments

Performance Principles

Avoid:

loading thousands of images at once

database queries during gallery scroll

Preferred approach:

static JSON pages + infinite scroll
Payment System

Payments are handled by a Node backend.

Workflow:

user selects photos
→ create order
→ redirect to payment provider
→ payment webhook confirms
→ enable download
Future Improvements

Possible optimizations:

precomputed bib indexes

CDN caching for JSON indexes

image format conversion (webp/avif)

serverless search endpoints