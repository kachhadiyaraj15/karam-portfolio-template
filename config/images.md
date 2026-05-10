---
# Image variables used by markdown content.
# Add your own files under assets/images and reference them with {{VARIABLE_NAME}}.

PROJECT1_IMAGE: assets/images/project1.jpg
PROJECT2_IMAGE: assets/images/project2.jpg
PROJECT3_IMAGE: assets/images/project3.jpg
---

# Usage

Use any variable from the frontmatter above inside markdown:

```markdown
image: {{PROJECT1_IMAGE}}

![Screenshot]({{PROJECT1_IMAGE}})
```

If you add a new image:

1. Put the file in `assets/images/`
2. Create a variable here
3. Run `npm run build`
