#!/usr/bin/env node

/**
 * Static Site Generator for Portfolio
 * Generates JSON files from markdown content for static deployment
 * Works on: Vercel, Cloudflare Pages, Netlify, GitHub Pages, etc.
 */

const fs = require('fs');
const path = require('path');

// Configuration Constants
const EXCERPT_LENGTH = 160;

// Configuration
const BLOG_DIR = 'blog';
const PLAYLISTS_DIR = 'playlists';
const PROJECTS_DIR = 'projects';
const EXPERIENCE_DIR = 'experience';
const HOME_DIR = 'home';
const ABOUT_DIR = 'about';
const CONFIG_DIR = 'config';
const OUTPUT_DIR = 'api-static';
const CONFIG_OUTPUT_DIR = path.join(OUTPUT_DIR, 'config');

const SHELL_PAGES = [
    {
        file: 'index.html',
        page: 'home',
        title: (config) => `${config.site_name || 'Portfolio'} | ${config.site_tagline || 'Selected work and writing'}`,
        description: (config) => config.site_description || 'Markdown-driven portfolio for projects, blog posts, and background.'
    },
    {
        file: 'experience.html',
        page: 'experience',
        title: (config) => `Experience | ${config.site_name || 'Portfolio'}`,
        description: () => 'Full-time roles, internships, and the work that shaped how I build.'
    },
    {
        file: 'experience-detail.html',
        page: 'experience',
        title: (config) => `Experience | ${config.site_name || 'Portfolio'}`,
        description: () => 'Experience detail and role summary.'
    },
    {
        file: 'about.html',
        page: 'about',
        title: (config) => `About | ${config.site_name || 'Portfolio'}`,
        description: () => 'Background, approach, and ways of working.'
    },
    {
        file: 'projects.html',
        page: 'projects',
        title: (config) => `Projects | ${config.site_name || 'Portfolio'}`,
        description: () => 'Project case studies, shipped interfaces, and technical explorations.'
    },
    {
        file: 'project-detail.html',
        page: 'projects',
        title: (config) => `Projects | ${config.site_name || 'Portfolio'}`,
        description: () => 'Project detail and case study.'
    },
    {
        file: 'blog.html',
        page: 'blog',
        title: (config) => `Blog | ${config.site_name || 'Portfolio'}`,
        description: () => 'Engineering notes, essays, and build write-ups.'
    },
    {
        file: 'blog-post.html',
        page: 'blog',
        title: (config) => `Blog | ${config.site_name || 'Portfolio'}`,
        description: () => 'Long-form writing and engineering notes.'
    },
    {
        file: 'playlists.html',
        page: 'playlists',
        title: (config) => `Playlists | ${config.site_name || 'Portfolio'}`,
        description: () => 'Curated blog series and reading paths.'
    },
    {
        file: 'playlist-detail.html',
        page: 'playlists',
        title: (config) => `Playlists | ${config.site_name || 'Portfolio'}`,
        description: () => 'Playlist reading path and ordered blog posts.'
    }
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Get all markdown files from a directory
 */
function getMarkdownFiles(dir, category = null) {
    const files = [];

    if (!fs.existsSync(dir)) {
        console.warn(`⚠️  Directory not found: ${dir}`);
        return files;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            // Recursively scan subdirectories
            const subCategory = category || item.name;
            const subFiles = getMarkdownFiles(
                path.join(dir, item.name),
                subCategory
            );
            files.push(...subFiles);
        } else if (item.isFile() && item.name.endsWith('.md') && !item.name.startsWith('_')) {
            const relativePath = category
                ? `${category}/${item.name}`
                : item.name;

            files.push({
                file: relativePath,
                category: category || 'general'
            });
        }
    }

    return files;
}

/**
 * Read file content
 */
function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
        return '';
    }
}

function stripFrontmatter(content) {
    if (!content.startsWith('---')) {
        return content;
    }

    const parts = content.split('---');
    if (parts.length < 3) {
        return content;
    }

    return parts.slice(2).join('---').trim();
}

function createNoteRecord({ id, title, kind, sourcePath, url, content, aliases = [], category = null, tags = [], date = '' }) {
    const aliasSet = new Set([
        id,
        title,
        ...(aliases || [])
    ].filter(Boolean));

    return {
        id,
        title,
        kind,
        sourcePath,
        url,
        category,
        tags,
        date,
        aliases: Array.from(aliasSet),
        content
    };
}

function createIdFromPath(filePath) {
    return filePath
        .replace(/\\/g, '/')
        .replace(/\.md$/i, '')
        .replace(/[\/\s]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
}

function ensureConfigOutputDir() {
    if (!fs.existsSync(CONFIG_OUTPUT_DIR)) {
        fs.mkdirSync(CONFIG_OUTPUT_DIR, { recursive: true });
    }
}

function getBrandMark(siteName = 'Portfolio') {
    return siteName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('') || 'P';
}

function resolveFooterText(value, siteName) {
    const defaultText = `© ${new Date().getFullYear()} ${siteName}.`;
    return (value || defaultText).replace(/\{\{\s*year\s*\}\}/gi, String(new Date().getFullYear()));
}

function parseNavigationConfig(navString) {
    if (!navString) return [];

    return navString.split(',')
        .map(item => {
            const [page, label, url] = item.split('|').map(part => part.trim());
            return { page, label, url };
        })
        .filter(item => item.page && item.label && item.url);
}

function isPageEnabled(config, pageName) {
    const key = `enable_${pageName}`;
    return config[key] !== false;
}

function buildNavigationHTML(config, currentPage) {
    const items = parseNavigationConfig(config.navigation)
        .filter(item => isPageEnabled(config, item.page));

    return items.map(item => {
        const isActive = item.page === currentPage;
        return `<a href="${item.url}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a>`;
    }).join('\n                    ');
}

function replaceTagContent(html, tag, className, value) {
    const pattern = new RegExp(`(<${tag} class="${className}">)([\\s\\S]*?)(</${tag}>)`);
    return html.replace(pattern, `$1${value}$3`);
}

function replaceTitle(html, value) {
    return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${value}</title>`);
}

function replaceMetaDescription(html, value) {
    return html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${value}">`);
}

function replaceNavigation(html, value) {
    return html.replace(/(<nav class="nav">)[\s\S]*?(<\/nav>)/, `$1\n                    ${value}\n                $2`);
}

function replaceThemeToggleDefault(html) {
    return html
        .replace(
            /<button id="theme-toggle" class="theme-toggle" type="button"[^>]*>/,
            '<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">'
        )
        .replace(/(<span class="theme-label">)[\s\S]*?(<\/span>)/, '$1Dark mode$2');
}

function renderHtmlShells(siteConfig) {
    console.log('  🧱 HTML shells...');

    const siteName = siteConfig.site_name || 'Portfolio';
    const siteTagline = siteConfig.site_tagline || 'Selected work and writing';
    const footerText = resolveFooterText(siteConfig.footer_text, siteName);
    const brandMark = getBrandMark(siteName);

    SHELL_PAGES.forEach(shell => {
        const filePath = path.join(shell.file);
        if (!fs.existsSync(filePath)) {
            return;
        }

        let html = readFileContent(filePath);
        html = replaceTitle(html, shell.title(siteConfig));
        html = replaceMetaDescription(html, shell.description(siteConfig));
        html = replaceTagContent(html, 'span', 'brand-mark', brandMark);
        html = replaceTagContent(html, 'span', 'brand-name', siteName);
        html = replaceTagContent(html, 'span', 'brand-tagline', siteTagline);
        html = replaceTagContent(html, 'p', 'footer-text', footerText);
        html = replaceNavigation(html, buildNavigationHTML(siteConfig, shell.page));
        html = replaceThemeToggleDefault(html);
        fs.writeFileSync(filePath, html);
    });

    console.log(`     ✓ Updated ${SHELL_PAGES.length} shell files`);
}

function generateConfigBootstrap(siteConfig, imageVariables) {
    console.log('  ⚡ Config bootstrap...');

    ensureConfigOutputDir();
    const bootstrap = {
        siteConfig,
        imageVariables
    };

    fs.writeFileSync(
        path.join(CONFIG_OUTPUT_DIR, 'bootstrap.js'),
        `window.__PORTFOLIO_BOOTSTRAP__ = ${JSON.stringify(bootstrap, null, 2)};\n`
    );

    console.log('     ✓ Generated bootstrap.js');
}

/**
 * Parse frontmatter from markdown
 */
function parseFrontmatter(content) {
    if (!content.startsWith('---')) {
        return {};
    }

    const parts = content.split('---');
    if (parts.length < 3) {
        return {};
    }

    const frontmatterText = parts[1].trim();
    const config = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Parse arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(item => item.trim());
        }
        // Parse booleans
        else if (value.toLowerCase() === 'true') value = true;
        else if (value.toLowerCase() === 'false') value = false;
        // Parse numbers
        else if (!isNaN(value) && value !== '') value = Number(value);

        config[key] = value;
    }

    return config;
}

/**
 * Generate blog files list
 */
function generateBlogFiles() {
    console.log('  📝 Blog posts...');

    const blogFiles = getMarkdownFiles(BLOG_DIR);
    const enrichedFiles = [];

    for (const fileInfo of blogFiles) {
        const filePath = path.join(BLOG_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);

        // Only include published posts
        if (metadata.published !== false) {
            // Extract id from filename
            const filenameParts = fileInfo.file.split('/');
            const id = filenameParts[filenameParts.length - 1].replace('.md', '');

            enrichedFiles.push({
                ...fileInfo,
                id,
                file: `blog/${fileInfo.file}`,
                ...metadata,
                excerpt: metadata.excerpt || (content.split('---').slice(2).join('---').trim().slice(0, EXCERPT_LENGTH) + '...')
            });
        }
    }

    // Sort by date newest first
    enrichedFiles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const output = {
        files: enrichedFiles,
        count: enrichedFiles.length,
        generated: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'blog-files.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ Bundled ${enrichedFiles.length} posts`);
    return enrichedFiles;
}

function createPlaylistSummary(post) {
    return {
        id: post.id,
        title: post.title,
        date: post.date || '',
        readingTime: post.readingTime || '',
        excerpt: post.excerpt || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        category: post.category || 'general',
        url: `blog-post.html?id=${post.id}`
    };
}

function generatePlaylistFiles(blogPosts = []) {
    console.log('  🎞️  Playlists...');

    const playlists = [];
    const postsById = new Map(blogPosts.map(post => [post.id, post]));

    if (!fs.existsSync(PLAYLISTS_DIR)) {
        fs.mkdirSync(PLAYLISTS_DIR, { recursive: true });
    }

    const playlistFiles = getMarkdownFiles(PLAYLISTS_DIR);
    for (const fileInfo of playlistFiles) {
        const filePath = path.join(PLAYLISTS_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);
        if (metadata.published === false) continue;

        const id = createIdFromPath(fileInfo.file);
        const postIds = Array.isArray(metadata.posts)
            ? metadata.posts.map(item => String(item).trim()).filter(Boolean)
            : [];
        const posts = [];

        for (const postId of postIds) {
            const post = postsById.get(postId);
            if (!post) {
                console.warn(`     ⚠️  Playlist "${id}" references missing post "${postId}"`);
                continue;
            }
            posts.push(createPlaylistSummary(post));
        }

        playlists.push({
            id,
            file: `playlists/${fileInfo.file}`,
            title: metadata.title || id,
            description: metadata.description || '',
            cover: metadata.cover || '',
            order: typeof metadata.order === 'number' ? metadata.order : 0,
            published: metadata.published !== false,
            posts,
            postIds: posts.map(post => post.id),
            count: posts.length,
            content: stripFrontmatter(content)
        });
    }

    playlists.sort((a, b) => {
        const orderDiff = (b.order || 0) - (a.order || 0);
        if (orderDiff !== 0) return orderDiff;
        return a.title.localeCompare(b.title);
    });

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'playlist-files.json'),
        JSON.stringify({
            files: playlists,
            count: playlists.length,
            generated: new Date().toISOString()
        }, null, 2)
    );

    console.log(`     ✓ Bundled ${playlists.length} playlists`);
}

/**
 * Generate project files list
 */
function generateProjectFiles() {
    console.log('  🚀 Projects...');

    const enrichedProjects = [];

    if (fs.existsSync(PROJECTS_DIR)) {
        const items = fs.readdirSync(PROJECTS_DIR);
        for (const item of items) {
            if (item.endsWith('.md') && !item.startsWith('_')) {
                const filePath = path.join(PROJECTS_DIR, item);
                const content = readFileContent(filePath);
                const metadata = parseFrontmatter(content);

                if (metadata.published !== false) {
                    // Extract id from filename
                    const id = item.replace('.md', '');

                    enrichedProjects.push({
                        id,
                        file: item,
                        ...metadata
                    });
                }
            }
        }
    }

    // Sort projects
    enrichedProjects.sort((a, b) => (b.order || 0) - (a.order || 0));

    const output = {
        files: enrichedProjects,
        count: enrichedProjects.length,
        generated: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'project-files.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ Bundled ${enrichedProjects.length} projects`);
}

/**
 * Generate home content
 */
function generateHomeContent() {
    console.log('  🏠 Home page...');

    const homePath = path.join(HOME_DIR, 'home.md');
    const content = fs.existsSync(homePath) ? readFileContent(homePath) : '';

    const output = {
        content: content,
        exists: content.length > 0,
        generated: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'home.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ ${output.exists ? 'Generated' : 'Not found'}`);
}

/**
 * Generate about content
 */
function generateAboutContent() {
    console.log('  👤 About page...');

    const aboutPath = path.join(ABOUT_DIR, 'about.md');
    const content = fs.existsSync(aboutPath) ? readFileContent(aboutPath) : '';

    const output = {
        content: content,
        exists: content.length > 0,
        generated: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'about.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ ${output.exists ? 'Generated' : 'Not found'}`);
}

/**
 * Generate image config
 */
function generateImageConfig() {
    console.log('  🖼️  Config (images)...');

    const configPath = path.join(CONFIG_DIR, 'images.md');
    const content = fs.existsSync(configPath) ? readFileContent(configPath) : '';
    const variables = parseFrontmatter(content);

    const output = {
        variables: variables,
        exists: Object.keys(variables).length > 0,
        generated: new Date().toISOString()
    };

    ensureConfigOutputDir();

    fs.writeFileSync(
        path.join(CONFIG_OUTPUT_DIR, 'images.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ ${output.exists ? 'Generated' : 'Not found'}`);
    return variables;
}

function generateExperienceFiles() {
    console.log('  💼 Experience...');

    const experienceFiles = getMarkdownFiles(EXPERIENCE_DIR);
    const enrichedExperience = [];

    for (const fileInfo of experienceFiles) {
        const filePath = path.join(EXPERIENCE_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);

        if (metadata.published !== false) {
            const id = createIdFromPath(fileInfo.file);
            enrichedExperience.push({
                id,
                file: fileInfo.file,
                category: fileInfo.category,
                employmentType: metadata.employmentType || fileInfo.category || 'General',
                ...metadata
            });
        }
    }

    enrichedExperience.sort((a, b) => {
        const orderDiff = (b.order || 0) - (a.order || 0);
        if (orderDiff !== 0) return orderDiff;
        return new Date(b.startDate || b.date || 0) - new Date(a.startDate || a.date || 0);
    });

    const output = {
        files: enrichedExperience,
        count: enrichedExperience.length,
        generated: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'experience-files.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ Bundled ${enrichedExperience.length} roles`);
}

/**
 * Generate site config
 */
function generateSiteConfig() {
    console.log('  ⚙️  Config (site)...');

    const configPath = path.join(CONFIG_DIR, 'site.md');
    const content = fs.existsSync(configPath) ? readFileContent(configPath) : '';
    const config = parseFrontmatter(content);

    const output = {
        config: config,
        exists: Object.keys(config).length > 0,
        generated: new Date().toISOString()
    };

    ensureConfigOutputDir();

    fs.writeFileSync(
        path.join(CONFIG_OUTPUT_DIR, 'site.json'),
        JSON.stringify(output, null, 2)
    );

    console.log(`     ✓ ${output.exists ? 'Generated' : 'Not found'}`);
    return config;
}

function generateNotesIndex() {
    console.log('  📚 Notes index...');

    const notes = [];

    // Blog notes
    const blogFiles = getMarkdownFiles(BLOG_DIR);
    for (const fileInfo of blogFiles) {
        const filePath = path.join(BLOG_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);
        if (metadata.published === false) continue;

        const filenameParts = fileInfo.file.split('/');
        const id = filenameParts[filenameParts.length - 1].replace('.md', '');
        notes.push(createNoteRecord({
            id,
            title: metadata.title || id,
            kind: 'blog',
            sourcePath: `blog/${fileInfo.file}`,
            url: `blog-post.html?id=${id}`,
            content: stripFrontmatter(content),
            aliases: [fileInfo.file.replace('.md', '')],
            category: fileInfo.category,
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            date: metadata.date || ''
        }));
    }

    // Project notes
    if (fs.existsSync(PROJECTS_DIR)) {
        const items = fs.readdirSync(PROJECTS_DIR);
        for (const item of items) {
            if (!item.endsWith('.md') || item.startsWith('_')) continue;
            const filePath = path.join(PROJECTS_DIR, item);
            const content = readFileContent(filePath);
            const metadata = parseFrontmatter(content);
            if (metadata.published === false) continue;

            const id = item.replace('.md', '');
            notes.push(createNoteRecord({
                id,
                title: metadata.title || id,
                kind: 'project',
                sourcePath: `projects/${item}`,
                url: `project-detail.html?id=${id}`,
                content: stripFrontmatter(content),
                aliases: [item.replace('.md', '')],
                tags: Array.isArray(metadata.technologies) ? metadata.technologies : [],
                date: metadata.date || ''
            }));
        }
    }

    // Experience notes
    const experienceFiles = getMarkdownFiles(EXPERIENCE_DIR);
    for (const fileInfo of experienceFiles) {
        const filePath = path.join(EXPERIENCE_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);
        if (metadata.published === false) continue;

        const id = createIdFromPath(fileInfo.file);
        notes.push(createNoteRecord({
            id,
            title: metadata.company || metadata.role || id,
            kind: 'experience',
            sourcePath: `experience/${fileInfo.file}`,
            url: `experience-detail.html?id=${id}`,
            content: stripFrontmatter(content),
            aliases: [fileInfo.file.replace('.md', ''), metadata.company, metadata.role].filter(Boolean),
            category: metadata.employmentType || fileInfo.category,
            tags: Array.isArray(metadata.technologies) ? metadata.technologies : [],
            date: metadata.startDate || metadata.date || ''
        }));
    }

    // Home note
    const homePath = path.join(HOME_DIR, 'home.md');
    if (fs.existsSync(homePath)) {
        const content = readFileContent(homePath);
        const metadata = parseFrontmatter(content);
        notes.push(createNoteRecord({
            id: 'home',
            title: metadata.name || metadata.title || 'Home',
            kind: 'page',
            sourcePath: 'home/home.md',
            url: 'index.html',
            content: stripFrontmatter(content),
            aliases: ['index', 'homepage', 'home'],
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            date: metadata.date || ''
        }));
    }

    // About note
    const aboutPath = path.join(ABOUT_DIR, 'about.md');
    if (fs.existsSync(aboutPath)) {
        const content = readFileContent(aboutPath);
        const metadata = parseFrontmatter(content);
        notes.push(createNoteRecord({
            id: 'about',
            title: metadata.name || metadata.tagline || 'About',
            kind: 'page',
            sourcePath: 'about/about.md',
            url: 'about.html',
            content: stripFrontmatter(content),
            aliases: ['about'],
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            date: metadata.date || ''
        }));
    }

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'notes.json'),
        JSON.stringify({
            notes,
            count: notes.length,
            generated: new Date().toISOString()
        }, null, 2)
    );

    console.log(`     ✓ Indexed ${notes.length} notes`);
}

/**
 * Main execution
 */
function main() {
    console.log('🔨 Building static content...\n');

    try {
        const blogPosts = generateBlogFiles();
        generatePlaylistFiles(blogPosts);
        generateProjectFiles();
        generateExperienceFiles();
        generateHomeContent();
        generateAboutContent();
        const imageVariables = generateImageConfig();
        const siteConfig = generateSiteConfig();
        generateNotesIndex();
        generateConfigBootstrap(siteConfig, imageVariables);
        renderHtmlShells(siteConfig);

        console.log('\n✅ Build complete! Site ready for deployment.\n');

    } catch (error) {
        console.error('\n❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
