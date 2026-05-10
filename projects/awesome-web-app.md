---
title: Portfolio Publishing System
description: A markdown-driven portfolio site designed for easy updates, stronger visual direction, and static deployment without framework overhead.
image: {{PROJECT1_IMAGE}}
technologies: [JavaScript, Node.js, HTML, CSS, Markdown]
githubUrl:
liveUrl:
demoUrl:
published: true
featured: true
date: 2026-03-01
---

## Overview

This project takes a plain static portfolio and turns it into a more professional publishing system. The goal is not to add more tooling. The goal is to make the existing stack easier to maintain, easier to deploy, and more intentional in how it looks and reads.

## What changed

* Reworked the visual system so the site feels more editorial and less like a starter template
* Moved the important copy into markdown files that are easy to update later
* Wired site configuration into navigation, titles, footer text, and feature flags
* Kept the build output static so deployment stays simple on Vercel

## Implementation notes

### Content pipeline

The build step reads markdown from the content folders and generates JSON into `api-static/`. That keeps the runtime simple while preserving a clean writing workflow.

### Frontend structure

The interface uses plain HTML, CSS, and JavaScript. That keeps the site easy to inspect, portable across hosts, and fast to adapt when priorities change.

### Config-first customization

Instead of scattering branding across multiple files, the site now relies more heavily on `config/site.md` for navigation labels, feature flags, and footer content.

## Why it matters

Personal sites usually fail for one of two reasons: the content is hard to update, or the design never moves beyond the starter state. This project addresses both by tightening the editing workflow and raising the design baseline.

## Next steps

- [ ] Replace the starter copy with final personal information
- [ ] Add real outbound links for projects and profiles
- [ ] Add custom images or screenshots for each case study
