#!/usr/bin/env node

/**
 * Static Site Generator for Portfolio
 * Generates JSON files from markdown content for static deployment
 * Works on: Vercel, Cloudflare Pages, Netlify, GitHub Pages, etc.
 */

const fs = require('fs');
const path = require('path');

function loadBuildDependency(packageName) {
    try {
        return require(packageName);
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw new Error(`Missing build dependency "${packageName}". Run "npm install" before "npm run build".`);
        }
        throw error;
    }
}

const MarkdownIt = loadBuildDependency('markdown-it');
const markdownItAnchor = loadBuildDependency('markdown-it-anchor');
const markdownItFootnote = loadBuildDependency('markdown-it-footnote');
const markdownItDeflist = loadBuildDependency('markdown-it-deflist');
const markdownItMark = loadBuildDependency('markdown-it-mark');
const markdownItSub = loadBuildDependency('markdown-it-sub');
const markdownItSup = loadBuildDependency('markdown-it-sup');
const markdownItTaskLists = loadBuildDependency('markdown-it-task-lists');
const markdownItEmoji = loadBuildDependency('markdown-it-emoji');
const hljs = loadBuildDependency('highlight.js');
const katex = loadBuildDependency('katex');
const cheerio = loadBuildDependency('cheerio');

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
const ASSETS_DIR = 'assets';
const OUTPUT_DIR = 'api-static';
const CONFIG_OUTPUT_DIR = path.join(OUTPUT_DIR, 'config');
const FAVICON_PATH = path.join(ASSETS_DIR, 'favicon.svg');
const ASSET_VERSION = String(Date.now());
const SEO_MANAGED_MARKER_START = '<!-- SEO:START -->';
const SEO_MANAGED_MARKER_END = '<!-- SEO:END -->';
const GENERATED_ROUTE_DIRS = [
    'blog-post',
    'project-detail',
    'playlist-detail',
    'experience-detail'
];
const ROOT_ROUTE_SHELLS = [
    ['about', 'about.html'],
    ['blog', 'blog.html'],
    ['blog-post', 'blog-post.html'],
    ['projects', 'projects.html'],
    ['project-detail', 'project-detail.html'],
    ['experience', 'experience.html'],
    ['experience-detail', 'experience-detail.html'],
    ['playlists', 'playlists.html'],
    ['playlist-detail', 'playlist-detail.html']
];

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
        description: () => 'Project detail and build notes.'
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

function removeGeneratedPath(relativePath) {
    const target = path.resolve(relativePath);
    const root = path.resolve(__dirname);

    if (target !== root && !target.startsWith(root + path.sep)) {
        throw new Error(`Refusing to remove path outside project: ${relativePath}`);
    }

    fs.rmSync(target, { recursive: true, force: true });
}

function cleanGeneratedOutputs() {
    removeGeneratedPath(OUTPUT_DIR);
    cleanupRootRouteAliases();
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

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugifyHeading(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function getMarkdownItPlugin(plugin) {
    if (typeof plugin === 'function') return plugin;
    if (typeof plugin?.default === 'function') return plugin.default;
    if (typeof plugin?.full === 'function') return plugin.full;
    return null;
}

class BuildMarkdownRenderer {
    constructor({ imageVariables = {}, notes = [] } = {}) {
        this.imageVariables = imageVariables;
        this.notes = notes;
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            breaks: false,
            typographer: true,
            highlight: (code, lang) => this.highlightCode(code, lang)
        });

        this.installMathRenderer();
        this.usePlugin(markdownItFootnote);
        this.usePlugin(markdownItDeflist);
        this.usePlugin(markdownItMark);
        this.usePlugin(markdownItSub);
        this.usePlugin(markdownItSup);
        this.usePlugin(markdownItTaskLists, { enabled: true });
        this.usePlugin(markdownItEmoji);
        this.usePlugin(markdownItAnchor, {
            slugify: slugifyHeading,
            level: [1, 2, 3, 4, 5, 6]
        });

        const defaultFence = this.md.renderer.rules.fence?.bind(this.md.renderer.rules);
        this.md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
            const token = tokens[idx];
            const info = token.info ? token.info.trim().toLowerCase() : '';

            if (info === 'mermaid') {
                return `<div class="mermaid">${escapeHtml(token.content.trim())}</div>`;
            }

            if (info === 'dataview' || info === 'chart' || info === 'kanban') {
                return [
                    `<div class="plugin-block plugin-${info}">`,
                    `<div class="plugin-label">${info}</div>`,
                    `<pre><code class="hljs language-${info}">${escapeHtml(token.content)}</code></pre>`,
                    '</div>'
                ].join('\n');
            }

            return defaultFence
                ? defaultFence(tokens, idx, opts, env, self)
                : self.renderToken(tokens, idx, opts);
        };
    }

    usePlugin(pluginExport, options) {
        const plugin = getMarkdownItPlugin(pluginExport);
        if (plugin) {
            this.md.use(plugin, options);
        }
    }

    installMathRenderer() {
        this.md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
            if (state.src[state.pos] !== '$' || state.src[state.pos + 1] === '$') {
                return false;
            }

            const start = state.pos + 1;
            let scan = start;
            let end = -1;

            while ((scan = state.src.indexOf('$', scan)) !== -1) {
                if (scan > start && state.src[scan - 1] !== '\\') {
                    end = scan;
                    break;
                }
                scan += 1;
            }

            if (end === -1) return false;

            if (!silent) {
                const token = state.push('math_inline', 'math', 0);
                token.content = state.src.slice(start, end);
            }

            state.pos = end + 1;
            return true;
        });

        this.md.block.ruler.after('blockquote', 'math_block', (state, startLine, endLine, silent) => {
            let pos = state.bMarks[startLine] + state.tShift[startLine];
            let max = state.eMarks[startLine];

            if (state.src.slice(pos, pos + 2) !== '$$') return false;

            let nextLine = startLine;
            let firstLine = state.src.slice(pos + 2, max);
            let content = '';
            let found = false;

            if (firstLine.trim().endsWith('$$') && firstLine.trim().length > 2) {
                content = firstLine.replace(/\$\$\s*$/, '');
                found = true;
            } else {
                content = firstLine;

                for (nextLine = startLine + 1; nextLine < endLine; nextLine += 1) {
                    pos = state.bMarks[nextLine] + state.tShift[nextLine];
                    max = state.eMarks[nextLine];
                    const line = state.src.slice(pos, max);
                    const closeIndex = line.indexOf('$$');

                    if (closeIndex !== -1) {
                        content += `\n${line.slice(0, closeIndex)}`;
                        found = true;
                        break;
                    }

                    content += `\n${line}`;
                }
            }

            if (!found) return false;
            if (silent) return true;

            const token = state.push('math_block', 'math', 0);
            token.block = true;
            token.content = content.trim();
            state.line = nextLine + 1;
            return true;
        }, {
            alt: ['paragraph', 'reference', 'blockquote', 'list']
        });

        this.md.renderer.rules.math_inline = (tokens, idx) => this.renderMath(tokens[idx].content, false);
        this.md.renderer.rules.math_block = (tokens, idx) => `<p>${this.renderMath(tokens[idx].content, true)}</p>\n`;
    }

    renderMath(content, displayMode) {
        try {
            return katex.renderToString(content, {
                displayMode,
                throwOnError: false,
                strict: false,
                trust: false
            });
        } catch (error) {
            const className = displayMode ? 'math-error math-display' : 'math-error';
            return `<span class="${className}">${escapeHtml(content)}</span>`;
        }
    }

    highlightCode(code, lang) {
        const language = String(lang || '').trim();
        if (language && hljs.getLanguage(language)) {
            try {
                return `<pre><code class="hljs language-${escapeHtml(language)}">${hljs.highlight(code, { language, ignoreIllegals: true }).value}</code></pre>`;
            } catch (error) {
                // Fall through to escaped code.
            }
        }

        return `<pre><code class="hljs">${escapeHtml(code)}</code></pre>`;
    }

    render(markdown, options = {}) {
        if (!markdown) return '';

        let prepared = this.replaceVariables(markdown);
        prepared = this.removeComments(prepared);
        prepared = this.injectBlockAnchors(prepared);

        if (prepared.includes('[[')) {
            prepared = this.replaceObsidianLinks(prepared, options);
        }

        let html = this.md.render(prepared);
        html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
        html = this.transformCallouts(html);
        html = this.decorateTags(html);
        return html;
    }

    replaceVariables(text) {
        let result = text;
        for (const [key, value] of Object.entries(this.imageVariables)) {
            result = result.replace(new RegExp(`\\{\\{${escapeRegExp(key)}\\}\\}`, 'g'), value);
        }
        return result;
    }

    removeComments(markdown) {
        return markdown.replace(/%%[\s\S]*?%%/g, '');
    }

    injectBlockAnchors(markdown) {
        return markdown.replace(/^(.+?)\s+\^([A-Za-z0-9_-]+)\s*$/gm, '$1 <span id="block-$2" class="block-anchor"></span>');
    }

    normalizeNoteKey(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\\/g, '/')
            .replace(/\.md$/i, '');
    }

    parseObsidianReference(rawReference) {
        const [targetPart, sizePart] = rawReference.split('|');
        const rawTarget = (targetPart || '').trim();
        const size = (sizePart || '').trim();
        if (!rawTarget) {
            return { target: '', size: '', noteName: '', heading: '', block: '' };
        }

        let noteName = rawTarget;
        let heading = '';
        let block = '';
        const hashIndex = rawTarget.indexOf('#');
        if (hashIndex >= 0) {
            noteName = rawTarget.slice(0, hashIndex).trim();
            const anchor = rawTarget.slice(hashIndex + 1).trim();
            if (anchor.startsWith('^')) {
                block = anchor.slice(1);
            } else {
                heading = anchor;
            }
        }

        return { target: rawTarget, size, noteName: noteName.trim(), heading, block };
    }

    findNote(reference) {
        const key = this.normalizeNoteKey(reference);
        if (!key) return null;

        return this.notes.find((note) => {
            const candidates = [
                note.id,
                note.title,
                note.name,
                note.file,
                note.path,
                note.url,
                ...(Array.isArray(note.aliases) ? note.aliases : [])
            ];

            return candidates.some(candidate => this.normalizeNoteKey(candidate) === key);
        }) || null;
    }

    buildNoteHref(note, heading = '', block = '') {
        if (!note) return '#';
        if (block) return `${note.url}#block-${block}`;
        if (heading) return `${note.url}#${slugifyHeading(heading)}`;
        return note.url;
    }

    extractHeadingSection(markdown, heading) {
        const lines = markdown.split('\n');
        const headingText = heading.trim().toLowerCase();
        let startIndex = -1;
        let headingLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(/^(#{1,6})\s+(.*)$/);
            if (!match) continue;
            if (match[2].trim().toLowerCase() === headingText) {
                startIndex = i;
                headingLevel = match[1].length;
                break;
            }
        }

        if (startIndex === -1) return markdown;

        const collected = [];
        for (let i = startIndex; i < lines.length; i++) {
            const match = lines[i].match(/^(#{1,6})\s+(.*)$/);
            if (i !== startIndex && match && match[1].length <= headingLevel) {
                break;
            }
            collected.push(lines[i]);
        }

        return collected.join('\n');
    }

    extractBlock(markdown, blockId) {
        const lines = markdown.split('\n');
        const target = `^${blockId}`;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(target)) {
                return lines[i].replace(new RegExp(`\\s*\\^${escapeRegExp(blockId)}\\s*$`), '');
            }
        }
        return markdown;
    }

    replaceObsidianLinks(markdown, options) {
        const codePlaceholders = [];
        const protect = (pattern) => {
            markdown = markdown.replace(pattern, (match) => {
                const token = `__MD_PLACEHOLDER_${codePlaceholders.length}__`;
                codePlaceholders.push(match);
                return token;
            });
        };

        protect(/```[\s\S]*?```/g);
        protect(/`[^`\n]+`/g);

        markdown = markdown.replace(/!\[\[([^\]]+)\]\]/g, (_, reference) => `\n\n${this.renderObsidianEmbed(reference, options)}\n\n`);
        markdown = markdown.replace(/\[\[([^\]]+)\]\]/g, (_, reference) => this.renderObsidianLink(reference));

        codePlaceholders.forEach((value, index) => {
            markdown = markdown.replace(`__MD_PLACEHOLDER_${index}__`, value);
        });

        return markdown;
    }

    renderObsidianLink(reference) {
        const [targetPart, aliasPart] = reference.split('|');
        const resolved = this.parseObsidianReference(targetPart);
        const alias = (aliasPart || '').trim();

        if (!resolved.noteName && resolved.heading) {
            return `<a href="#${slugifyHeading(resolved.heading)}" class="wikilink">${escapeHtml(alias || resolved.heading)}</a>`;
        }

        const note = this.findNote(resolved.noteName || resolved.target);
        if (!note) {
            return `<span class="wikilink missing">${escapeHtml(alias || resolved.target)}</span>`;
        }

        const label = alias || note.title || resolved.noteName || resolved.target;
        return `<a href="${this.buildNoteHref(note, resolved.heading, resolved.block)}" class="wikilink">${escapeHtml(label)}</a>`;
    }

    renderObsidianEmbed(reference, options = {}) {
        const resolved = this.parseObsidianReference(reference);
        const target = resolved.target;

        if (this.isImageFile(target)) {
            const mediaUrl = this.resolveMediaUrl(target);
            const size = this.parseObsidianImageSize(resolved.size);
            const style = [
                size.width ? `width:${size.width}px` : '',
                size.height ? `height:${size.height}px` : ''
            ].filter(Boolean).join(';');
            return `<img src="${mediaUrl}" alt="${escapeHtml(target)}" loading="lazy"${style ? ` style="${style}"` : ''}>`;
        }

        if (this.isPdfFile(target)) {
            return `<iframe class="file-embed file-embed-pdf" src="${this.resolveMediaUrl(target)}" title="${escapeHtml(target)}"></iframe>`;
        }

        if (this.isAudioFile(target)) {
            return `<audio class="file-embed file-embed-audio" controls src="${this.resolveMediaUrl(target)}"></audio>`;
        }

        if (this.isVideoFile(target)) {
            return `<video class="file-embed file-embed-video" controls src="${this.resolveMediaUrl(target)}"></video>`;
        }

        return this.renderEmbeddedNote(reference, options);
    }

    renderEmbeddedNote(reference, options = {}) {
        const resolved = this.parseObsidianReference(reference);
        const note = this.findNote(resolved.noteName || resolved.target);
        if (!note) {
            return `<div class="note-embed missing"><div class="note-embed-label">Missing note</div><div class="note-embed-body">${escapeHtml(reference)}</div></div>`;
        }

        const depth = options.depth || 0;
        const visited = new Set(options.visited || []);
        if (visited.has(note.url) || depth > 3) {
            return `<div class="note-embed"><div class="note-embed-label">Embedded note</div><div class="note-embed-body"><a href="${this.buildNoteHref(note, resolved.heading, resolved.block)}">${escapeHtml(note.title)}</a></div></div>`;
        }

        visited.add(note.url);
        let embeddedMarkdown = note.content || '';
        if (!embeddedMarkdown.trim()) {
            return `<div class="note-embed"><div class="note-embed-label">Embedded note</div><div class="note-embed-body"><a href="${this.buildNoteHref(note, resolved.heading, resolved.block)}">${escapeHtml(note.title)}</a></div></div>`;
        }

        if (resolved.heading) {
            embeddedMarkdown = this.extractHeadingSection(embeddedMarkdown, resolved.heading);
        }
        if (resolved.block) {
            embeddedMarkdown = this.extractBlock(embeddedMarkdown, resolved.block);
        }

        const embeddedHtml = this.render(embeddedMarkdown, {
            depth: depth + 1,
            visited
        });

        return [
            '<article class="note-embed">',
            '<div class="note-embed-label">',
            `<span>Embedded note</span><a href="${this.buildNoteHref(note, resolved.heading, resolved.block)}">${escapeHtml(note.title)}</a>`,
            '</div>',
            '<div class="note-embed-body prose">',
            embeddedHtml,
            '</div>',
            '</article>'
        ].join('\n');
    }

    isImageFile(target) {
        return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(target);
    }

    isAudioFile(target) {
        return /\.(mp3|wav|ogg|m4a)$/i.test(target);
    }

    isVideoFile(target) {
        return /\.(mp4|webm|mov|m4v)$/i.test(target);
    }

    isPdfFile(target) {
        return /\.pdf$/i.test(target);
    }

    resolveMediaUrl(target) {
        const trimmed = target.trim();
        if (/^(https?:)?\/\//i.test(trimmed) || trimmed.includes('/')) {
            return trimmed;
        }
        if (this.isImageFile(trimmed)) {
            return `assets/images/${trimmed}`;
        }
        return trimmed;
    }

    parseObsidianImageSize(sizeValue) {
        if (!sizeValue) return {};
        const exact = sizeValue.trim().match(/^(\d+)x(\d+)$/i);
        if (exact) {
            return { width: exact[1], height: exact[2] };
        }
        const widthOnly = sizeValue.trim().match(/^(\d+)$/);
        if (widthOnly) {
            return { width: widthOnly[1] };
        }
        return {};
    }

    transformCallouts(html) {
        const $ = cheerio.load(html, { decodeEntities: false }, false);

        $('blockquote').each((_, element) => {
            const blockquote = $(element);
            const firstParagraph = blockquote.children('p').first();
            if (!firstParagraph.length) return;

            const lines = firstParagraph.html().trim().split(/\n+/);
            const markerLine = (lines.shift() || '').trim();
            const match = markerLine.match(/^\[!([A-Za-z0-9_-]+)\]([+-])?\s*(.*)$/);
            if (!match) return;

            const type = match[1].toLowerCase();
            const foldState = match[2] || '';
            const title = match[3] || type.charAt(0).toUpperCase() + type.slice(1);
            const inlineBodyHtml = lines.join('<br>').trim();
            const bodyParts = [];
            if (inlineBodyHtml) {
                bodyParts.push(`<p>${inlineBodyHtml}</p>`);
            }
            blockquote.children().slice(1).each((__, child) => {
                bodyParts.push($.html(child));
            });
            const body = `<div class="callout-content">${bodyParts.join('')}</div>`;

            if (foldState) {
                blockquote.replaceWith(`<details class="callout callout-${type}"${foldState === '+' ? ' open' : ''}><summary class="callout-title">${escapeHtml(title)}</summary>${body}</details>`);
                return;
            }

            blockquote.replaceWith(`<div class="callout callout-${type}"><div class="callout-title">${escapeHtml(title)}</div>${body}</div>`);
        });

        return $.html();
    }

    decorateTags(html) {
        const $ = cheerio.load(html, { decodeEntities: false }, false);
        const skipParents = new Set(['a', 'code', 'pre', 'script', 'style']);

        function decorateNode(node) {
            const element = $(node);
            if (node.type === 'text') {
                const parentName = node.parent?.name?.toLowerCase();
                if (skipParents.has(parentName)) return;
                const text = node.data || '';
                if (!/(^|\s)#([A-Za-z0-9/_-]+)/.test(text)) return;
                element.replaceWith(escapeHtml(text).replace(/(^|\s)#([A-Za-z0-9/_-]+)/g, '$1<span class="obsidian-tag">#$2</span>'));
                return;
            }

            if (node.children && !skipParents.has(node.name?.toLowerCase())) {
                node.children.slice().forEach(decorateNode);
            }
        }

        $.root().contents().toArray().forEach(decorateNode);
        return $.html();
    }
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

function generateFavicon(siteConfig) {
    console.log('  🔖 Favicon...');

    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }

    const mark = getBrandMark(siteConfig.site_name || 'Portfolio').slice(0, 2);
    const fontSize = mark.length > 1 ? 25 : 31;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
        <linearGradient id="mark-bg" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0f6b68"/>
            <stop offset="1" stop-color="#b55d2c"/>
        </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="#fbf7ef"/>
    <rect x="5" y="5" width="54" height="54" rx="15" fill="url(#mark-bg)"/>
    <text x="32" y="41" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="1" fill="#fff">${escapeHtml(mark)}</text>
</svg>
`;

    fs.writeFileSync(FAVICON_PATH, svg);
    console.log(`     ✓ Generated ${FAVICON_PATH.replace(/\\/g, '/')}`);
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

const GITHUB_ICON_PATH = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

function buildSourceCodeGithubHTML(config) {
    const enabledValue = config.source_code_github_icon;
    const enabled = enabledValue !== false && String(enabledValue).toLowerCase() !== 'false';
    const url = String(config.source_code_github_url || '').trim();

    if (!enabled || !url) {
        return '';
    }

    const label = config.source_code_github_label || 'Source code';
    return `<a href="${escapeHtml(url)}" class="source-code-link" target="_blank" rel="noopener noreferrer" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="${GITHUB_ICON_PATH}"></path>
                    </svg>
                </a>`;
}

function replaceSourceCodeGithubLink(html, config) {
    const withoutExistingLink = html.replace(/\s*<a href="[^"]*" class="source-code-link"[\s\S]*?<\/a>\r?\n?/g, '');
    const linkHtml = buildSourceCodeGithubHTML(config);

    if (!linkHtml) {
        return withoutExistingLink;
    }

    return withoutExistingLink.replace(
        /(\s*<button id="theme-toggle")/,
        `\n                ${linkHtml}$1`
    );
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

function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncateText(value, maxLength = 155) {
    const text = stripHtml(value);
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1).trim()}…`;
}

function normalizeSiteUrl(config) {
    const rawUrl = config.site_url
        || config.siteUrl
        || config.base_url
        || process.env.SITE_URL
        || process.env.URL
        || process.env.CF_PAGES_URL
        || '';
    return String(rawUrl || '').trim().replace(/\/+$/, '');
}

function normalizePagePath(pagePath = 'index.html') {
    const normalized = String(pagePath || 'index.html').replace(/^\/+/, '');
    return normalized || 'index.html';
}

function absoluteUrl(config, pagePath = 'index.html') {
    const siteUrl = normalizeSiteUrl(config);
    const normalizedPath = normalizePagePath(pagePath);
    if (!siteUrl) return normalizedPath;
    return `${siteUrl}/${normalizedPath}`;
}

function absoluteAssetUrl(config, assetPath = '') {
    if (!assetPath) return '';
    if (/^https?:\/\//i.test(assetPath)) return assetPath;
    return absoluteUrl(config, assetPath);
}

function buildJsonLdScript(schema) {
    return `    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
}

function buildPersonSchema(config) {
    const siteName = config.site_name || 'Portfolio';
    const sameAs = [
        config.social_github,
        config.social_twitter,
        config.social_linkedin,
        config.social_youtube,
        config.social_website
    ].filter(Boolean);

    return {
        '@type': 'Person',
        name: siteName,
        url: absoluteUrl(config, 'index.html'),
        description: config.site_tagline || config.site_description || '',
        email: config.social_email ? `mailto:${config.social_email}` : undefined,
        sameAs: sameAs.length ? sameAs : undefined
    };
}

function removeUndefinedValues(value) {
    if (Array.isArray(value)) {
        return value.map(removeUndefinedValues).filter(item => item !== undefined);
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, item]) => item !== undefined && item !== '')
                .map(([key, item]) => [key, removeUndefinedValues(item)])
        );
    }

    return value;
}

function buildShellSchema(config, shell, title, description) {
    const pageUrl = absoluteUrl(config, shell.file);
    const person = buildPersonSchema(config);
    const basePage = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: pageUrl,
        isPartOf: {
            '@type': 'WebSite',
            name: config.site_name || 'Portfolio',
            url: absoluteUrl(config, 'index.html')
        },
        about: person
    };

    if (shell.page === 'home') {
        return [
            {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: config.site_name || 'Portfolio',
                url: absoluteUrl(config, 'index.html'),
                description,
                publisher: person
            },
            {
                '@context': 'https://schema.org',
                ...person
            }
        ].map(removeUndefinedValues);
    }

    if (shell.file === 'blog.html') {
        return [removeUndefinedValues({ ...basePage, '@type': 'Blog' })];
    }

    if (shell.file === 'projects.html' || shell.file === 'playlists.html' || shell.file === 'experience.html') {
        return [removeUndefinedValues({ ...basePage, '@type': 'CollectionPage' })];
    }

    if (shell.file === 'about.html') {
        return [removeUndefinedValues({ ...basePage, '@type': 'AboutPage' })];
    }

    return [removeUndefinedValues(basePage)];
}

function buildSeoHeadTags(config, { title, description, pagePath, type = 'website', image = '', schema = [] }) {
    const pageUrl = absoluteUrl(config, pagePath);
    const imageUrl = absoluteAssetUrl(config, image || config.seo_image || config.site_image || '');
    const tags = [
        `    <link rel="canonical" href="${escapeHtml(pageUrl)}">`,
        '    <meta name="robots" content="index, follow, max-image-preview:large">',
        `    <meta property="og:type" content="${escapeHtml(type)}">`,
        `    <meta property="og:site_name" content="${escapeHtml(config.site_name || 'Portfolio')}">`,
        `    <meta property="og:title" content="${escapeHtml(title)}">`,
        `    <meta property="og:description" content="${escapeHtml(description)}">`,
        `    <meta property="og:url" content="${escapeHtml(pageUrl)}">`,
        `    <meta property="og:locale" content="${escapeHtml(config.seo_locale || 'en_US')}">`,
        `    <meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">`,
        `    <meta name="twitter:title" content="${escapeHtml(title)}">`,
        `    <meta name="twitter:description" content="${escapeHtml(description)}">`,
        '    <meta name="theme-color" content="#fbf7ef">'
    ];

    if (imageUrl) {
        tags.splice(7, 0, `    <meta property="og:image" content="${escapeHtml(imageUrl)}">`);
        tags.splice(tags.length - 1, 0, `    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">`);
    }

    if (Array.isArray(schema)) {
        schema.forEach(item => tags.push(buildJsonLdScript(item)));
    }

    return `${SEO_MANAGED_MARKER_START}\n${tags.join('\n')}\n${SEO_MANAGED_MARKER_END}`;
}

function injectSeoHead(html, config, seoData) {
    const cleanHtml = html.replace(
        new RegExp(`\\s*${escapeRegExp(SEO_MANAGED_MARKER_START)}[\\s\\S]*?${escapeRegExp(SEO_MANAGED_MARKER_END)}\\s*`, 'g'),
        '\n'
    );
    const block = buildSeoHeadTags(config, seoData);

    return cleanHtml.replace(
        /(<meta name="description" content="[^"]*">\r?\n?)/,
        `$1${block}\n`
    );
}

function injectFaviconLinks(html) {
    const faviconLinks = [
        '    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">',
        '    <link rel="shortcut icon" href="assets/favicon.svg">'
    ].join('\n');

    const withoutExistingLinks = html
        .replace(/^\s*<link rel="(?:shortcut )?icon"[^>]*>\r?\n?/gmi, '')
        .replace(/^\s*<link rel="apple-touch-icon"[^>]*>\r?\n?/gmi, '');

    if (withoutExistingLinks.includes('href="assets/favicon.svg"')) {
        return withoutExistingLinks;
    }

    return withoutExistingLinks.replace(
        /(<meta name="description" content="[^"]*">\r?\n?)/,
        `$1${faviconLinks}\n`
    );
}

function applyShellAssetVersion(html) {
    return html
        .replace(/href="styles\.css(?:\?v=[^"]*)?"/g, `href="styles.css?v=${ASSET_VERSION}"`)
        .replace(/src="api-static\/config\/bootstrap\.js(?:\?v=[^"]*)?"/g, `src="api-static/config/bootstrap.js?v=${ASSET_VERSION}"`)
        .replace(/src="blog\.js(?:\?v=[^"]*)?"/g, `src="blog.js?v=${ASSET_VERSION}"`);
}

function addBaseHref(html) {
    const withoutExistingBase = html.replace(/^\s*<base\s+href="[^"]*">\r?\n?/gmi, '');
    return withoutExistingBase.replace(/(<head>\r?\n?)/i, '$1    <base href="/">\n');
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

function removeBuildTimeMarkdownScripts(html) {
    return html.replace(
        /^\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/(?:markdown-it[^"]*|highlight\.js@[^"]*\/lib\/common\.min\.js)" defer><\/script>\r?\n?/gm,
        ''
    );
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
        const title = shell.title(siteConfig);
        const description = truncateText(shell.description(siteConfig));
        html = replaceTitle(html, escapeHtml(title));
        html = replaceMetaDescription(html, escapeHtml(description));
        html = injectSeoHead(html, siteConfig, {
            title,
            description,
            pagePath: shell.file,
            type: shell.file === 'blog-post.html' ? 'article' : 'website',
            schema: buildShellSchema(siteConfig, shell, title, description)
        });
        html = injectFaviconLinks(html);
        html = replaceTagContent(html, 'span', 'brand-mark', brandMark);
        html = replaceTagContent(html, 'span', 'brand-name', siteName);
        html = replaceTagContent(html, 'span', 'brand-tagline', siteTagline);
        html = replaceTagContent(html, 'p', 'footer-text', footerText);
        html = replaceNavigation(html, buildNavigationHTML(siteConfig, shell.page));
        html = replaceSourceCodeGithubLink(html, siteConfig);
        html = replaceThemeToggleDefault(html);
        html = removeBuildTimeMarkdownScripts(html);
        html = applyShellAssetVersion(html);
        fs.writeFileSync(filePath, html);
    });

    console.log(`     ✓ Updated ${SHELL_PAGES.length} shell files`);
}

function cleanupRootRouteAliases() {
    ROOT_ROUTE_SHELLS
        .map(([routePath]) => path.join(...routePath.split('/').filter(Boolean), 'index.html'))
        .forEach(aliasPath => {
            if (fs.existsSync(aliasPath)) {
                fs.rmSync(aliasPath, { force: true });
            }
        });

    GENERATED_ROUTE_DIRS.forEach(routeDir => {
        if (fs.existsSync(routeDir)) {
            fs.rmSync(routeDir, { recursive: true, force: true });
        }
    });
}

function writeRootRouteAlias(routePath, shellFile) {
    const segments = String(routePath || '')
        .split(/[\\/]+/)
        .filter(Boolean);

    if (segments.length === 0 || segments.some(segment => segment === '..' || path.isAbsolute(segment))) {
        throw new Error(`Invalid route alias: ${routePath}`);
    }

    if (!fs.existsSync(shellFile)) {
        return false;
    }

    const target = path.join(...segments, 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, addBaseHref(readFileContent(shellFile)));
    return true;
}

function generateRootRouteAliases({ blogPosts = [], playlists = [], projects = [], experience = [] } = {}) {
    console.log('  🧭 Root route aliases...');

    cleanupRootRouteAliases();

    let aliasCount = 0;
    ROOT_ROUTE_SHELLS.forEach(([routePath, shellFile]) => {
        if (writeRootRouteAlias(routePath, shellFile)) aliasCount += 1;
    });

    blogPosts
        .filter(post => post?.id)
        .forEach(post => {
            if (writeRootRouteAlias(`blog-post/${post.id}`, 'blog-post.html')) aliasCount += 1;
        });

    projects
        .filter(project => project?.id)
        .forEach(project => {
            if (writeRootRouteAlias(`project-detail/${project.id}`, 'project-detail.html')) aliasCount += 1;
        });

    playlists
        .filter(playlist => playlist?.id)
        .forEach(playlist => {
            if (writeRootRouteAlias(`playlist-detail/${playlist.id}`, 'playlist-detail.html')) aliasCount += 1;
        });

    experience
        .filter(entry => entry?.id)
        .forEach(entry => {
            if (writeRootRouteAlias(`experience-detail/${entry.id}`, 'experience-detail.html')) aliasCount += 1;
        });

    console.log(`     ✓ Generated ${aliasCount} root route aliases`);
}

function generateConfigBootstrap(siteConfig, imageVariables) {
    console.log('  ⚡ Config bootstrap...');

    ensureConfigOutputDir();
    const bootstrap = {
        buildVersion: ASSET_VERSION,
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
            value = value.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean);
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
function generateBlogFiles(renderer) {
    console.log('  📝 Blog posts...');

    const blogFiles = getMarkdownFiles(BLOG_DIR);
    const enrichedFiles = [];

    for (const fileInfo of blogFiles) {
        const filePath = path.join(BLOG_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);
        const markdownContent = stripFrontmatter(content);

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
                content: markdownContent,
                html: renderer.render(markdownContent),
                excerpt: metadata.excerpt || (markdownContent.trim().slice(0, EXCERPT_LENGTH) + '...')
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
        url: `blog-post/${post.id}/`
    };
}

function generatePlaylistFiles(blogPosts = [], renderer) {
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
        const markdownContent = stripFrontmatter(content);
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
            content: markdownContent,
            html: renderer.render(markdownContent)
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
    return playlists;
}

/**
 * Generate project files list
 */
function generateProjectFiles(renderer) {
    console.log('  🚀 Projects...');

    const enrichedProjects = [];

    if (fs.existsSync(PROJECTS_DIR)) {
        const projectFiles = getMarkdownFiles(PROJECTS_DIR);
        for (const fileInfo of projectFiles) {
            const filePath = path.join(PROJECTS_DIR, fileInfo.file);
            const content = readFileContent(filePath);
            const metadata = parseFrontmatter(content);
            const markdownContent = stripFrontmatter(content);

            if (metadata.published !== false) {
                const filenameParts = fileInfo.file.split('/');
                const id = filenameParts[filenameParts.length - 1].replace('.md', '');

                const category = fileInfo.category !== 'general'
                    ? fileInfo.category
                    : (metadata.category || 'general');

                enrichedProjects.push({
                    ...fileInfo,
                    id,
                    file: fileInfo.file,
                    ...metadata,
                    category,
                    content: markdownContent,
                    html: renderer.render(markdownContent)
                });
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
    return enrichedProjects;
}

/**
 * Generate home content
 */
function generateHomeContent(renderer) {
    console.log('  🏠 Home page...');

    const homePath = path.join(HOME_DIR, 'home.md');
    const content = fs.existsSync(homePath) ? readFileContent(homePath) : '';
    const markdownContent = stripFrontmatter(content);

    const output = {
        content: content,
        html: renderer.render(markdownContent),
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
function generateAboutContent(renderer) {
    console.log('  👤 About page...');

    const aboutPath = path.join(ABOUT_DIR, 'about.md');
    const content = fs.existsSync(aboutPath) ? readFileContent(aboutPath) : '';
    const markdownContent = stripFrontmatter(content);

    const output = {
        content: content,
        html: renderer.render(markdownContent),
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

function generateExperienceFiles(renderer) {
    console.log('  💼 Experience...');

    const experienceFiles = getMarkdownFiles(EXPERIENCE_DIR);
    const enrichedExperience = [];

    for (const fileInfo of experienceFiles) {
        const filePath = path.join(EXPERIENCE_DIR, fileInfo.file);
        const content = readFileContent(filePath);
        const metadata = parseFrontmatter(content);
        const markdownContent = stripFrontmatter(content);

        if (metadata.published !== false) {
            const id = createIdFromPath(fileInfo.file);
            enrichedExperience.push({
                id,
                file: fileInfo.file,
                category: fileInfo.category,
                employmentType: metadata.employmentType || fileInfo.category || 'General',
                ...metadata,
                content: markdownContent,
                html: renderer.render(markdownContent)
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
    return enrichedExperience;
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

function collectNotesIndex() {
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
            url: `blog-post/${id}/`,
            content: stripFrontmatter(content),
            aliases: [fileInfo.file.replace('.md', '')],
            category: fileInfo.category,
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            date: metadata.date || ''
        }));
    }

    // Project notes
    if (fs.existsSync(PROJECTS_DIR)) {
        const projectFiles = getMarkdownFiles(PROJECTS_DIR);
        for (const fileInfo of projectFiles) {
            const filePath = path.join(PROJECTS_DIR, fileInfo.file);
            const content = readFileContent(filePath);
            const metadata = parseFrontmatter(content);
            if (metadata.published === false) continue;

            const filenameParts = fileInfo.file.split('/');
            const id = filenameParts[filenameParts.length - 1].replace('.md', '');
            const category = fileInfo.category !== 'general'
                ? fileInfo.category
                : (metadata.category || 'general');
            notes.push(createNoteRecord({
                id,
                title: metadata.title || id,
                kind: 'project',
                sourcePath: `projects/${fileInfo.file}`,
                url: `project-detail/${id}/`,
                content: stripFrontmatter(content),
                aliases: Array.from(new Set([fileInfo.file.replace('.md', ''), id])),
                category,
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
            url: `experience-detail/${id}/`,
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

    return notes;
}

function generateNotesIndex(notes, renderer) {
    console.log('  📚 Notes index...');

    const renderedNotes = notes.map(note => ({
        ...note,
        html: renderer.render(note.content || '')
    }));

    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'notes.json'),
        JSON.stringify({
            notes: renderedNotes,
            count: renderedNotes.length,
            generated: new Date().toISOString()
        }, null, 2)
    );

    console.log(`     ✓ Indexed ${renderedNotes.length} notes`);
}

function escapeXml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatSitemapDate(value) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
}

function createSitemapEntry(config, pagePath, { priority = '0.7', changefreq = 'monthly', lastmod = '' } = {}) {
    return [
        '  <url>',
        `    <loc>${escapeXml(absoluteUrl(config, pagePath))}</loc>`,
        `    <lastmod>${escapeXml(formatSitemapDate(lastmod))}</lastmod>`,
        `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
        `    <priority>${escapeXml(priority)}</priority>`,
        '  </url>'
    ].join('\n');
}

function generateSeoFiles(siteConfig, { blogPosts = [], playlists = [], projects = [], experience = [] } = {}) {
    console.log('  🔎 SEO files...');

    const entries = [];
    const navigationPages = parseNavigationConfig(siteConfig.navigation)
        .filter(item => isPageEnabled(siteConfig, item.page));

    navigationPages.forEach(item => {
        const isHome = item.url === 'index.html';
        entries.push(createSitemapEntry(siteConfig, item.url, {
            priority: isHome ? '1.0' : '0.8',
            changefreq: item.page === 'blog' ? 'weekly' : 'monthly'
        }));
    });

    blogPosts.forEach(post => {
        entries.push(createSitemapEntry(siteConfig, `blog-post/${encodeURIComponent(post.id)}/`, {
            priority: '0.75',
            changefreq: 'monthly',
            lastmod: post.updated || post.date
        }));
    });

    projects.forEach(project => {
        entries.push(createSitemapEntry(siteConfig, `project-detail/${encodeURIComponent(project.id)}/`, {
            priority: project.featured ? '0.75' : '0.65',
            changefreq: 'monthly',
            lastmod: project.updated || project.date
        }));
    });

    playlists.forEach(playlist => {
        entries.push(createSitemapEntry(siteConfig, `playlist-detail/${encodeURIComponent(playlist.id)}/`, {
            priority: '0.65',
            changefreq: 'monthly'
        }));
    });

    experience.forEach(entry => {
        entries.push(createSitemapEntry(siteConfig, `experience-detail/${encodeURIComponent(entry.id)}/`, {
            priority: '0.55',
            changefreq: 'yearly',
            lastmod: entry.updated || entry.endDate || entry.startDate || entry.date
        }));
    });

    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries.join('\n'),
        '</urlset>',
        ''
    ].join('\n');

    fs.writeFileSync('sitemap.xml', sitemap);

    const robotsLines = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${absoluteUrl(siteConfig, 'sitemap.xml')}`,
        ''
    ];

    fs.writeFileSync('robots.txt', robotsLines.join('\n'));

    if (!normalizeSiteUrl(siteConfig)) {
        console.warn('     ⚠️  Set site_url in config/site.md before production so canonical URLs and sitemap locations are absolute.');
    }

    console.log(`     ✓ Generated sitemap.xml with ${entries.length} URLs`);
    console.log('     ✓ Generated robots.txt');
}

/**
 * Main execution
 */
function main() {
    console.log('🔨 Building static content...\n');

    try {
        cleanGeneratedOutputs();

        const imageVariables = generateImageConfig();
        const siteConfig = generateSiteConfig();
        const notes = collectNotesIndex();
        const renderer = new BuildMarkdownRenderer({ imageVariables, notes });

        const blogPosts = generateBlogFiles(renderer);
        const playlists = generatePlaylistFiles(blogPosts, renderer);
        const projects = generateProjectFiles(renderer);
        const experience = generateExperienceFiles(renderer);
        generateHomeContent(renderer);
        generateAboutContent(renderer);
        generateNotesIndex(notes, renderer);
        generateConfigBootstrap(siteConfig, imageVariables);
        generateFavicon(siteConfig);
        renderHtmlShells(siteConfig);
        generateSeoFiles(siteConfig, { blogPosts, playlists, projects, experience });
        generateRootRouteAliases({ blogPosts, playlists, projects, experience });

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
