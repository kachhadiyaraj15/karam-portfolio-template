---
company: Company Name
role: Role Title
description: A short description used in the experience list card.
employmentType: Full Time
location: City, Country
startDate: 2026-01
endDate: 2026-12
current: false
published: true
featured: false
order: 100
website: https://example.com
technologies: [Leadership, Product, Engineering]
---

# Experience Entry Template

Use this template for any experience entry that will later appear in the Experience section.

## Frontmatter fields

- `company`: Company name shown in the list/detail view
- `role`: Your position title
- `description`: Short summary for the experience list card
- `employmentType`: Category label such as `Full Time` or `Internship`
- `location`: Optional location text
- `startDate`: Start date in `YYYY-MM` format
- `endDate`: End date in `YYYY-MM` format, or leave as present text later if needed
- `current`: `true` if this role is ongoing
- `published`: whether it should appear on the site
- `featured`: optional highlight flag if you later want special UI treatment
- `order`: manual ordering control, higher can appear first
- `website`: company or reference URL
- `technologies`: optional chips/tags to show in the detail page

## Recommended structure

## Overview

Write a concise overview of the role and what made it important.

## Responsibilities

* Responsibility one
* Responsibility two
* Responsibility three

## Impact

* Outcome or measurable result
* Outcome or measurable result
* Outcome or measurable result

## Notable Work

### Project or initiative

Describe one important initiative, what you owned, and what changed.

## Tools and Systems

List the tools, systems, or domains you worked with.

```markdown
* Product strategy
* React / TypeScript
* Python / automation
* Internal dashboards
```

## Lessons

What became clearer because of this role?

## Notes

- Keep the `description` short because it will likely be used in the list page.
- Put the richer detail in the markdown body.
- Use the `employmentType` field consistently so the UI can show the right tag later.
