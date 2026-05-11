---
# Global site settings for the markdown-driven portfolio.
# Update these values first when you personalize the site.

site_name: Karam
site_tagline: Product-minded software engineer
site_description: A markdown-driven portfolio for projects, blog posts, and background.
site_url: 
seo_image: assets/images/project1.jpg
seo_locale: en_US

enable_home: true
enable_about: true
enable_projects: true
enable_blog: true
enable_playlists: true
enable_experience: true

navigation: home|Home|index.html, experience|Experience|experience.html, projects|Projects|projects.html, blog|Blog|blog.html, playlists|Playlists|playlists.html, about|About|about.html

feature_theme_toggle: true
feature_blog_filters: true
feature_project_tags: true
feature_social_links: true

social_github: https://github.com/karam-demo
social_twitter: https://x.com/karam_demo
social_linkedin: https://www.linkedin.com/in/karam-demo/
social_youtube: https://www.youtube.com/@karam-demo
social_email: karam.demo@example.com
social_website: https://www.example.com/karam

home_show_bio: true
home_show_social: true
home_show_quick_links: false

about_show_location: true
about_show_social: true

projects_show_featured_only: false
projects_grid_columns: 3

blog_posts_per_page: 10
blog_show_excerpts: true
blog_show_reading_time: true
blog_show_categories: true
blog_show_tags: true
blog_enable_filters: true

footer_text: Copyright {{year}} Karam. Designed with intention and built for the web.
---

# Editing Notes

1. Change `site_name`, `site_tagline`, and `site_description` to your real branding.
2. Keep navigation entries in the format `page|Label|file.html`.
3. Leave any social value blank if you do not want it to appear.
4. Toggle feature flags here instead of editing templates.
5. After changing this file, run `npm run build`.
