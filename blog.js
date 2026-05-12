// ===========================
// Configuration Constants
// ===========================

const CONFIG = {
    EXCERPT_LENGTH: 160,
    DEFAULT_READING_TIME: '5 min read',
    DEFAULT_CATEGORY: 'general'
};

// ===========================
// Skeleton Loader Utility
// ===========================

function renderSkeletonLoader(variant = 'default') {
    const templates = {
        default: `
            <div class="skeleton-loader">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line subtitle"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
            </div>`,
        card: `
            <div class="skeleton-loader" style="padding: var(--spacing-lg);">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
            </div>`,
        hero: `
            <div class="skeleton-loader">
                <div class="skeleton-line title" style="width:35%;"></div>
                <div class="skeleton-line subtitle" style="width:50%;"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
            </div>`
    };
    return templates[variant] || templates.default;
}

const SOCIAL_PLATFORMS = [
    { key: 'twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', label: 'X' },
    { key: 'github', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', label: 'GitHub' },
    { key: 'linkedin', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', label: 'LinkedIn' },
    { key: 'youtube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', label: 'YouTube' },
    { key: 'email', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', label: 'Email', isEmail: true },
    { key: 'website', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', label: 'Website' }
];

function getSocialDisplayName(platform, rawValue, data = {}) {
    const customLabel = data[`${platform.key}_label`] || data[`${platform.key}_name`];
    if (customLabel) return String(customLabel);

    if (!rawValue) return platform.label;

    if (platform.isEmail) {
        const [localPart] = String(rawValue).split('@');
        return localPart || String(rawValue);
    }

    try {
        const url = new URL(rawValue);
        const hostname = url.hostname.replace(/^www\./, '');
        const segments = url.pathname.split('/').filter(Boolean).map(segment => decodeURIComponent(segment));

        if (platform.key === 'twitter') {
            const handle = segments[0];
            return handle ? (handle.startsWith('@') ? handle : `@${handle}`) : platform.label;
        }

        if (platform.key === 'github') {
            return segments[0] || hostname;
        }

        if (platform.key === 'linkedin') {
            const handle = segments[0] === 'in' || segments[0] === 'company'
                ? segments[1]
                : segments[segments.length - 1];
            return handle || hostname;
        }

        if (platform.key === 'youtube') {
            const handle = segments[0] || segments[segments.length - 1];
            return handle ? (handle.startsWith('@') ? handle : handle) : hostname;
        }

        if (platform.key === 'website') {
            return hostname;
        }

        return segments[segments.length - 1] || hostname;
    } catch (error) {
        return String(rawValue);
    }
}

function buildSocialLinks(data, wrapperClass, linkClass) {
    const links = SOCIAL_PLATFORMS
        .filter(platform => Boolean(data[platform.key]))
        .map(platform => {
            const value = data[platform.key];
            const href = platform.isEmail ? `mailto:${value}` : value;
            const displayName = getSocialDisplayName(platform, value, data);
            return `
                <a href="${href}" class="${linkClass} social-link social-link--${platform.key}" target="${platform.isEmail ? '_self' : '_blank'}" rel="noopener noreferrer" title="${platform.label}" aria-label="${platform.label}: ${displayName}">
                    <span class="social-icon-wrap" aria-hidden="true">
                        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="${platform.icon}"/>
                        </svg>
                    </span>
                    <span class="social-copy">
                        <span class="social-label">${displayName}</span>
                        <span class="social-meta">${platform.label}</span>
                    </span>
                    <span class="social-arrow" aria-hidden="true">↗</span>
                </a>
            `;
        });

    if (links.length === 0) {
        return '';
    }

    return `<div class="${wrapperClass}">${links.join('')}</div>`;
}

function getGithubIconPath() {
    return SOCIAL_PLATFORMS.find(platform => platform.key === 'github')?.icon || '';
}

function getSourceCodeGithubSettings(configManager) {
    const enabledValue = configManager?.getSiteConfig?.('source_code_github_icon');
    const enabled = enabledValue !== false && String(enabledValue).toLowerCase() !== 'false';
    const url = getConfigValue(configManager, 'source_code_github_url', 'sourceCodeGithubUrl');
    const label = getConfigValue(configManager, 'source_code_github_label', 'sourceCodeGithubLabel') || 'Source code';

    return {
        enabled: enabled && Boolean(url),
        url,
        label
    };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function stripHtmlTags(value) {
    return String(value || '')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function truncateSeoText(value, maxLength = 155) {
    const text = stripHtmlTags(value);
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1).trim()}...`;
}

function getConfigValue(configManager, ...keys) {
    for (const key of keys) {
        const value = configManager?.getSiteConfig?.(key);
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return value;
        }
    }

    return '';
}

function getRuntimeBaseUrl(configManager) {
    const configuredUrl = String(getConfigValue(configManager, 'site_url', 'siteUrl', 'base_url')).trim();
    if (configuredUrl) {
        return configuredUrl.replace(/\/+$/, '');
    }

    return window.location.origin;
}

function buildRuntimeUrl(configManager, pagePath = '') {
    const rawPath = String(pagePath || '').trim();
    if (/^https?:\/\//i.test(rawPath)) {
        return rawPath;
    }

    const baseUrl = `${getRuntimeBaseUrl(configManager)}/`;
    const normalizedPath = rawPath.replace(/^\.?\//, '');
    return new URL(normalizedPath || window.location.pathname.replace(/^\//, ''), baseUrl).href;
}

function getPathDetailId(routeName, pathname = window.location.pathname) {
    const route = String(routeName || '').replace(/\.html$/i, '');
    const segments = decodeURIComponent(pathname || '')
        .replace(/\\/g, '/')
        .split('/')
        .filter(Boolean)
        .map(segment => segment.replace(/\.html$/i, ''));
    const routeIndex = segments.findIndex(segment => segment === route);

    if (routeIndex === -1 || !segments[routeIndex + 1]) {
        return '';
    }

    return segments[routeIndex + 1].trim();
}

function getUrlDetailId(routeName, paramName = 'id') {
    const urlParams = new URLSearchParams(window.location.search);
    return (urlParams.get(paramName) || getPathDetailId(routeName) || '').trim();
}

function buildDetailPath(routeName, id, params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.set(key, value);
        }
    });

    const queryString = query.toString();
    const path = `${routeName}/${encodeURIComponent(id)}/`;
    return queryString ? `${path}?${queryString}` : path;
}

function getRuntimeImageUrl(configManager, imagePath = '') {
    const configuredImage = imagePath || getConfigValue(configManager, 'seo_image', 'og_image', 'site_image');
    if (!configuredImage) return '';

    const replacedImage = configManager?.replaceVariables?.(configuredImage) || configuredImage;
    return buildRuntimeUrl(configManager, replacedImage);
}

function setHeadElement(tagName, selector, attributes, textContent = null) {
    let element = document.head.querySelector(selector);
    if (!element) {
        element = document.createElement(tagName);
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            element.removeAttribute(key);
        } else {
            element.setAttribute(key, String(value));
        }
    });

    element.setAttribute('data-runtime-seo', 'true');

    if (textContent !== null) {
        element.textContent = textContent;
    }

    return element;
}

function cleanStructuredData(value) {
    if (Array.isArray(value)) {
        return value
            .map(item => cleanStructuredData(item))
            .filter(item => item !== undefined && !(Array.isArray(item) && item.length === 0));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value)
                .map(([key, item]) => [key, cleanStructuredData(item)])
                .filter(([, item]) => item !== undefined && !(Array.isArray(item) && item.length === 0))
        );
    }

    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    return value;
}

function buildRuntimePersonSchema(configManager) {
    const sameAs = [
        getConfigValue(configManager, 'social_github'),
        getConfigValue(configManager, 'social_twitter'),
        getConfigValue(configManager, 'social_linkedin'),
        getConfigValue(configManager, 'social_youtube'),
        getConfigValue(configManager, 'social_website')
    ].filter(Boolean);

    return cleanStructuredData({
        '@type': 'Person',
        name: configManager?.getSiteName?.() || 'Portfolio',
        url: buildRuntimeUrl(configManager, 'about.html'),
        email: getConfigValue(configManager, 'social_email')
            ? `mailto:${getConfigValue(configManager, 'social_email')}`
            : undefined,
        sameAs
    });
}

function updateRuntimeSeo({ configManager, title, description, pagePath, type = 'website', image = '', schema = [] }) {
    const siteName = configManager?.getSiteName?.() || 'Portfolio';
    const seoTitle = title || siteName;
    const seoDescription = truncateSeoText(description || configManager?.getSiteDescription?.() || '');
    const canonicalUrl = buildRuntimeUrl(configManager, pagePath);
    const imageUrl = getRuntimeImageUrl(configManager, image);
    const locale = getConfigValue(configManager, 'seo_locale') || 'en_US';

    document.title = seoTitle;

    setHeadElement('meta', 'meta[name="description"]', {
        name: 'description',
        content: seoDescription
    });
    setHeadElement('link', 'link[rel="canonical"]', {
        rel: 'canonical',
        href: canonicalUrl
    });
    setHeadElement('meta', 'meta[property="og:site_name"]', {
        property: 'og:site_name',
        content: siteName
    });
    setHeadElement('meta', 'meta[property="og:title"]', {
        property: 'og:title',
        content: seoTitle
    });
    setHeadElement('meta', 'meta[property="og:description"]', {
        property: 'og:description',
        content: seoDescription
    });
    setHeadElement('meta', 'meta[property="og:type"]', {
        property: 'og:type',
        content: type === 'article' ? 'article' : 'website'
    });
    setHeadElement('meta', 'meta[property="og:url"]', {
        property: 'og:url',
        content: canonicalUrl
    });
    setHeadElement('meta', 'meta[property="og:locale"]', {
        property: 'og:locale',
        content: locale
    });
    if (imageUrl) {
        setHeadElement('meta', 'meta[property="og:image"]', {
            property: 'og:image',
            content: imageUrl
        });
        setHeadElement('meta', 'meta[name="twitter:image"]', {
            name: 'twitter:image',
            content: imageUrl
        });
    }
    setHeadElement('meta', 'meta[name="twitter:card"]', {
        name: 'twitter:card',
        content: imageUrl ? 'summary_large_image' : 'summary'
    });
    setHeadElement('meta', 'meta[name="twitter:title"]', {
        name: 'twitter:title',
        content: seoTitle
    });
    setHeadElement('meta', 'meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: seoDescription
    });

    document.head.querySelectorAll('script[data-runtime-seo-schema]').forEach(script => script.remove());
    const schemas = (Array.isArray(schema) ? schema : [schema])
        .map(item => cleanStructuredData(item))
        .filter(Boolean);

    schemas.forEach(item => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-runtime-seo-schema', 'true');
        script.setAttribute('data-runtime-seo', 'true');
        script.textContent = JSON.stringify(item).replace(/</g, '\\u003c');
        document.head.appendChild(script);
    });
}

function slugifyHeading(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function getNameDisplayModifier(name) {
    const normalized = String(name || '').trim();
    const compactLength = normalized.replace(/\s+/g, '').length;
    const words = normalized.split(/\s+/).filter(Boolean).length;

    if (compactLength >= 18 || words >= 3) {
        return 'name-display--wide';
    }

    if (compactLength >= 11 || words >= 2) {
        return 'name-display--compact';
    }

    return '';
}

function normalizeMarkdownTables(root) {
    root.querySelectorAll('.prose table').forEach((table) => {
        if (table.parentElement?.classList.contains('prose-table-wrap')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'prose-table-wrap';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

function getPluginBlockType(block) {
    return Array.from(block.classList)
        .find(className => className.startsWith('plugin-') && className !== 'plugin-block')
        ?.replace('plugin-', '') || '';
}

function getPluginBlockSource(block) {
    if (block.dataset.source) {
        return block.dataset.source;
    }

    const code = block.querySelector('pre code');
    const source = code ? code.textContent.trim() : '';
    block.dataset.source = source;
    return source;
}

function parseInlineList(value) {
    const normalized = String(value || '').trim();
    if (!normalized) return [];

    const raw = normalized.replace(/^\[/, '').replace(/\]$/, '');
    return raw.split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
        .map(item => {
            const numeric = Number(item);
            return Number.isFinite(numeric) && item !== '' ? numeric : item;
        });
}

function parseChartConfig(source) {
    const lines = String(source || '').split('\n');
    const config = {
        type: 'bar',
        labels: [],
        series: []
    };

    let currentSeries = null;
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let match = trimmed.match(/^type:\s*(.+)$/i);
        if (match) {
            config.type = match[1].trim().toLowerCase();
            return;
        }

        match = trimmed.match(/^labels:\s*(.+)$/i);
        if (match) {
            config.labels = parseInlineList(match[1]).map(value => String(value));
            return;
        }

        match = trimmed.match(/^-+\s*title:\s*(.+)$/i);
        if (match) {
            currentSeries = {
                title: match[1].trim(),
                data: []
            };
            config.series.push(currentSeries);
            return;
        }

        match = trimmed.match(/^data:\s*(.+)$/i);
        if (match && currentSeries) {
            currentSeries.data = parseInlineList(match[1]).map(value => Number(value) || 0);
            return;
        }

        match = trimmed.match(/^title:\s*(.+)$/i);
        if (match) {
            config.title = match[1].trim();
        }
    });

    if (config.series.length === 0 && config.labels.length > 0) {
        config.series.push({
            title: 'Series 1',
            data: config.labels.map(() => 0)
        });
    }

    return config;
}

function getChartSeriesPalette(index) {
    const palette = [
        ['#0f8b8d', 'rgba(15, 139, 141, 0.18)'],
        ['#f28f3b', 'rgba(242, 143, 59, 0.18)'],
        ['#6c63ff', 'rgba(108, 99, 255, 0.18)'],
        ['#d94868', 'rgba(217, 72, 104, 0.18)'],
        ['#2a9d8f', 'rgba(42, 157, 143, 0.18)']
    ];

    return palette[index % palette.length];
}

function formatChartValue(value) {
    const numeric = Number(value || 0);
    if (Math.abs(numeric) >= 1000) {
        return `${Math.round(numeric / 100) / 10}k`;
    }
    return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}

function getChartScale(values, steps = 4) {
    const max = Math.max(1, ...values.map(value => Number(value || 0)));
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const normalized = max / magnitude;
    let niceMax = 10;

    if (normalized <= 2) {
        niceMax = 2;
    } else if (normalized <= 5) {
        niceMax = 5;
    }

    niceMax *= magnitude;
    if (niceMax < max) {
        niceMax *= 2;
    }

    return {
        max: niceMax,
        ticks: Array.from({ length: steps + 1 }, (_, index) => (niceMax / steps) * index)
    };
}

function renderBarChart(config) {
    const labels = config.labels;
    const series = config.series;
    const allValues = series.flatMap(item => item.data);
    const scale = getChartScale(allValues);
    const chartHeight = 210;
    const top = 26;
    const right = 28;
    const bottom = 48;
    const left = 56;
    const plotHeight = chartHeight - top - bottom;
    const groupWidth = 82;
    const barGap = 8;
    const chartWidth = Math.max(440, labels.length * groupWidth + left + right);
    const plotWidth = chartWidth - left - right;
    const seriesWidth = Math.max(16, Math.min(34, (groupWidth - 22 - ((series.length - 1) * barGap)) / Math.max(series.length, 1)));
    const yForValue = value => top + plotHeight - ((Number(value || 0) / scale.max) * plotHeight);

    const grid = scale.ticks.map((tick) => {
        const y = yForValue(tick);
        return `
            <line x1="${left}" y1="${y}" x2="${chartWidth - right}" y2="${y}" class="plugin-chart-grid"></line>
            <text x="${left - 10}" y="${y + 4}" text-anchor="end" class="plugin-chart-axis-label">${formatChartValue(tick)}</text>
        `;
    }).join('');

    const bars = labels.flatMap((label, labelIndex) => {
        const groupCenter = left + (labelIndex + 0.5) * (plotWidth / Math.max(labels.length, 1));
        const groupStart = groupCenter - (((series.length * seriesWidth) + ((series.length - 1) * barGap)) / 2);
        return series.map((entry, seriesIndex) => {
            const value = Number(entry.data[labelIndex] || 0);
            const y = yForValue(value);
            const height = Math.max(2, top + plotHeight - y);
            const x = groupStart + seriesIndex * (seriesWidth + barGap);
            const [stroke, fill] = getChartSeriesPalette(seriesIndex);
            return `
                <rect x="${x}" y="${y}" width="${seriesWidth}" height="${height}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="1.5"></rect>
                <text x="${x + (seriesWidth / 2)}" y="${Math.max(13, y - 7)}" text-anchor="middle" class="plugin-chart-value">${formatChartValue(value)}</text>
            `;
        }).join('');
    }).join('');

    const xLabels = labels.map((label, index) => `
        <text x="${left + (index + 0.5) * (plotWidth / Math.max(labels.length, 1))}" y="${chartHeight - 18}" text-anchor="middle" class="plugin-chart-axis-label">${escapeHtml(label)}</text>
    `).join('');

    return `
        <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="plugin-chart-svg" role="img" aria-label="${escapeHtml(config.title || 'Bar chart')}">
            ${grid}
            <line x1="${left}" y1="${top + plotHeight}" x2="${chartWidth - right}" y2="${top + plotHeight}" class="plugin-chart-axis"></line>
            ${bars}
            ${xLabels}
        </svg>
    `;
}

function renderLineChart(config) {
    const labels = config.labels;
    const series = config.series;
    const allValues = series.flatMap(item => item.data);
    const scale = getChartScale(allValues);
    const chartWidth = Math.max(460, labels.length * 96);
    const chartHeight = 230;
    const top = 28;
    const right = 34;
    const bottom = 48;
    const left = 56;
    const plotHeight = chartHeight - top - bottom;
    const plotWidth = chartWidth - left - right;
    const pointsX = labels.map((_, index) => left + index * (plotWidth / Math.max(labels.length - 1, 1)));
    const yForValue = value => top + plotHeight - ((Number(value || 0) / scale.max) * plotHeight);

    const grid = scale.ticks.map((tick) => {
        const y = yForValue(tick);
        return `
            <line x1="${left}" y1="${y}" x2="${chartWidth - right}" y2="${y}" class="plugin-chart-grid"></line>
            <text x="${left - 10}" y="${y + 4}" text-anchor="end" class="plugin-chart-axis-label">${formatChartValue(tick)}</text>
        `;
    }).join('');

    const lines = series.map((entry, seriesIndex) => {
        const [stroke, fill] = getChartSeriesPalette(seriesIndex);
        const points = entry.data.map((value, index) => `${pointsX[index]},${yForValue(value)}`).join(' ');
        const areaPoints = `${left},${top + plotHeight} ${points} ${chartWidth - right},${top + plotHeight}`;

        const circles = entry.data.map((value, index) => {
            const y = yForValue(value);
            return `
                <circle cx="${pointsX[index]}" cy="${y}" r="4.5" fill="${stroke}" stroke="var(--surface-strong)" stroke-width="2"></circle>
                <text x="${pointsX[index]}" y="${Math.max(13, y - 10)}" text-anchor="middle" class="plugin-chart-value">${formatChartValue(value)}</text>
            `;
        }).join('');

        return `
            <polygon points="${areaPoints}" fill="${fill}"></polygon>
            <polyline fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}"></polyline>
            ${circles}
        `;
    }).join('');

    const xLabels = labels.map((label, index) => `
        <text x="${pointsX[index]}" y="${chartHeight - 18}" text-anchor="middle" class="plugin-chart-axis-label">${escapeHtml(label)}</text>
    `).join('');

    return `
        <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="plugin-chart-svg" role="img" aria-label="${escapeHtml(config.title || 'Line chart')}">
            ${grid}
            <line x1="${left}" y1="${top + plotHeight}" x2="${chartWidth - right}" y2="${top + plotHeight}" class="plugin-chart-axis"></line>
            ${lines}
            ${xLabels}
        </svg>
    `;
}

function renderPieChart(config, doughnut = false) {
    const data = config.series[0]?.data || [];
    const total = Math.max(1, data.reduce((sum, value) => sum + Number(value || 0), 0));
    let start = 0;
    const segments = data.map((value, index) => {
        const ratio = Number(value || 0) / total;
        const end = start + ratio * 360;
        const [stroke] = getChartSeriesPalette(index);
        const segment = `${stroke} ${start}deg ${end}deg`;
        start = end;
        return segment;
    }).join(', ');

    const legend = config.labels.map((label, index) => {
        const [stroke] = getChartSeriesPalette(index);
        const value = data[index] ?? 0;
        return `
            <li class="plugin-chart-legend-item">
                <span class="plugin-chart-legend-swatch" style="--legend-color:${stroke}"></span>
                <span class="plugin-chart-legend-label">${escapeHtml(label)}</span>
                <span class="plugin-chart-legend-value">${value}</span>
            </li>
        `;
    }).join('');

    return `
        <div class="plugin-chart-polar">
            <div class="plugin-chart-disc${doughnut ? ' doughnut' : ''}" style="--chart-segments:${segments}"></div>
            <ul class="plugin-chart-legend">${legend}</ul>
        </div>
    `;
}

function renderRadarChart(config) {
    const labels = config.labels;
    const data = config.series[0]?.data || [];
    const maxValue = Math.max(1, ...data);
    const centerX = 170;
    const centerY = 150;
    const radius = 100;
    const angleStep = (Math.PI * 2) / Math.max(labels.length, 1);

    const rings = [0.25, 0.5, 0.75, 1].map((ratio) => {
        const points = labels.map((_, index) => {
            const angle = -Math.PI / 2 + index * angleStep;
            const x = centerX + Math.cos(angle) * radius * ratio;
            const y = centerY + Math.sin(angle) * radius * ratio;
            return `${x},${y}`;
        }).join(' ');
        return `<polygon points="${points}" class="plugin-radar-ring"></polygon>`;
    }).join('');

    const spokes = labels.map((label, index) => {
        const angle = -Math.PI / 2 + index * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const labelX = centerX + Math.cos(angle) * (radius + 22);
        const labelY = centerY + Math.sin(angle) * (radius + 22);
        return `
            <line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" class="plugin-radar-spoke"></line>
            <text x="${labelX}" y="${labelY}" text-anchor="middle" class="plugin-radar-label">${escapeHtml(label)}</text>
        `;
    }).join('');

    const areaPoints = labels.map((_, index) => {
        const angle = -Math.PI / 2 + index * angleStep;
        const valueRadius = (Number(data[index] || 0) / maxValue) * radius;
        const x = centerX + Math.cos(angle) * valueRadius;
        const y = centerY + Math.sin(angle) * valueRadius;
        return `${x},${y}`;
    }).join(' ');

    return `
        <svg viewBox="0 0 340 320" class="plugin-chart-svg plugin-chart-radar" role="img" aria-label="${escapeHtml(config.title || 'Radar chart')}">
            ${rings}
            ${spokes}
            <polygon points="${areaPoints}" class="plugin-radar-area"></polygon>
        </svg>
    `;
}

function renderChartPluginBlock(block, source) {
    const config = parseChartConfig(source);
    const type = config.type || 'bar';
    let chartMarkup = '';

    if (type === 'bar') {
        chartMarkup = renderBarChart(config);
    } else if (type === 'line') {
        chartMarkup = renderLineChart(config);
    } else if (type === 'pie') {
        chartMarkup = renderPieChart(config, false);
    } else if (type === 'doughnut') {
        chartMarkup = renderPieChart(config, true);
    } else if (type === 'radar') {
        chartMarkup = renderRadarChart(config);
    } else {
        chartMarkup = `<div class="plugin-empty">Unsupported chart type: ${escapeHtml(type)}</div>`;
    }

    const seriesSummary = config.series.map((entry, index) => {
        const [stroke] = getChartSeriesPalette(index);
        return `
            <li class="plugin-series-item">
                <span class="plugin-series-swatch" style="--legend-color:${stroke}"></span>
                <span>${escapeHtml(entry.title || `Series ${index + 1}`)}</span>
            </li>
        `;
    }).join('');

    const body = `
        <div class="plugin-chart-panel">
            <div class="plugin-chart-meta">
                <span class="plugin-chart-type">${escapeHtml(type)}</span>
                <span class="plugin-chart-points">${config.labels.length} points</span>
            </div>
            <div class="plugin-chart-viewport">
                ${chartMarkup}
            </div>
            ${seriesSummary ? `<ul class="plugin-series-list">${seriesSummary}</ul>` : ''}
        </div>
    `;

    const existing = block.querySelector('.plugin-rendered');
    if (existing) {
        existing.innerHTML = body;
    } else {
        const rendered = document.createElement('div');
        rendered.className = 'plugin-rendered plugin-rendered-chart';
        rendered.innerHTML = body;
        block.appendChild(rendered);
    }

    const sourcePre = block.querySelector('pre');
    if (sourcePre) {
        sourcePre.hidden = true;
    }
}

function parseKanbanTasks(source) {
    return String(source || '').split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line) => {
            const match = line.match(/^-\s+\[([ xX])\]\s+(.+)$/);
            if (!match) return null;
            return {
                done: match[1].toLowerCase() === 'x',
                title: match[2].trim()
            };
        })
        .filter(Boolean);
}

function renderKanbanPluginBlock(block, source) {
    const tasks = parseKanbanTasks(source);
    const pending = tasks.filter(task => !task.done);
    const completed = tasks.filter(task => task.done);

    const renderColumn = (title, items, modifier) => `
        <section class="plugin-kanban-column ${modifier}">
            <header class="plugin-kanban-column-title">${title}</header>
            <div class="plugin-kanban-cards">
                ${items.length > 0
                    ? items.map(item => `<article class="plugin-kanban-card">${escapeHtml(item.title)}</article>`).join('')
                    : '<div class="plugin-empty">No cards</div>'}
            </div>
        </section>
    `;

    const body = `
        <div class="plugin-kanban-board">
            ${renderColumn('To do', pending, 'is-open')}
            ${renderColumn('Done', completed, 'is-done')}
        </div>
    `;

    const existing = block.querySelector('.plugin-rendered');
    if (existing) {
        existing.innerHTML = body;
    } else {
        const rendered = document.createElement('div');
        rendered.className = 'plugin-rendered plugin-rendered-kanban';
        rendered.innerHTML = body;
        block.appendChild(rendered);
    }

    const sourcePre = block.querySelector('pre');
    if (sourcePre) {
        sourcePre.hidden = true;
    }
}

function normalizeQueryToken(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/^#/, '')
        .replace(/\s+/g, '-');
}

function parseDataviewQuery(source) {
    const lines = String(source || '').split('\n').map(line => line.trim()).filter(Boolean);
    const query = {
        columns: ['file.name'],
        source: '',
        raw: lines
    };

    lines.forEach((line) => {
        let match = line.match(/^TABLE\s+(.+)$/i);
        if (match) {
            query.columns = match[1].split(',').map(item => item.trim()).filter(Boolean);
            return;
        }

        match = line.match(/^FROM\s+(.+)$/i);
        if (match) {
            query.source = match[1].trim();
        }
    });

    return query;
}

function getRuntimeNotesIndex() {
    if (Array.isArray(window.__PORTFOLIO_NOTES_CACHE__)) {
        return Promise.resolve(window.__PORTFOLIO_NOTES_CACHE__);
    }

    if (window.__PORTFOLIO_NOTES_PROMISE__) {
        return window.__PORTFOLIO_NOTES_PROMISE__;
    }

    window.__PORTFOLIO_NOTES_PROMISE__ = fetch('/api-static/notes.json', { cache: 'no-cache' })
        .then(response => response.json())
        .then((payload) => {
            window.__PORTFOLIO_NOTES_CACHE__ = payload.notes || [];
            return window.__PORTFOLIO_NOTES_CACHE__;
        })
        .catch(() => []);

    return window.__PORTFOLIO_NOTES_PROMISE__;
}

function filterDataviewNotes(notes, query) {
    if (!query.source) {
        return notes.slice(0, 6);
    }

    const normalizedSource = normalizeQueryToken(query.source);
    return notes.filter((note) => {
        const noteTags = Array.isArray(note.tags) ? note.tags.map(normalizeQueryToken) : [];
        const category = normalizeQueryToken(note.category || '');
        const kind = normalizeQueryToken(note.kind || '');
        return noteTags.includes(normalizedSource)
            || category === normalizedSource
            || kind === normalizedSource;
    }).slice(0, 6);
}

function renderDataviewCell(note, column) {
    const key = column.toLowerCase();

    if (key === 'file.name' || key === 'title') {
        return `<a href="${note.url}" class="inline-link">${escapeHtml(note.title || note.id || 'Untitled')}</a>`;
    }

    if (key === 'tags') {
        const tags = Array.isArray(note.tags) ? note.tags : [];
        if (tags.length === 0) {
            return '<span class="plugin-empty-inline">No tags</span>';
        }
        return tags.map(tag => `<span class="plugin-query-chip">${escapeHtml(tag)}</span>`).join('');
    }

    if (key === 'kind') {
        return escapeHtml(note.kind || 'note');
    }

    if (key === 'category') {
        return escapeHtml(note.category || note.kind || 'general');
    }

    if (key === 'date') {
        return escapeHtml(note.date || '—');
    }

    return escapeHtml(note[column] || note.id || '—');
}

function renderDataviewPluginBlock(block, source, notes) {
    const query = parseDataviewQuery(source);
    const rows = filterDataviewNotes(notes, query);
    const header = query.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('');
    const bodyRows = rows.map(note => `
        <tr>
            ${query.columns.map(column => `<td>${renderDataviewCell(note, column)}</td>`).join('')}
        </tr>
    `).join('');

    const body = `
        <div class="plugin-query-panel">
            <div class="plugin-query-meta">
                <span class="plugin-query-chip">Table</span>
                ${query.source ? `<span class="plugin-query-chip">From ${escapeHtml(query.source)}</span>` : ''}
                <span class="plugin-query-chip">${rows.length} row${rows.length !== 1 ? 's' : ''}</span>
            </div>
            ${rows.length > 0 ? `
                <div class="prose-table-wrap plugin-dataview-wrap">
                    <table class="plugin-dataview-table">
                        <thead>
                            <tr>${header}</tr>
                        </thead>
                        <tbody>
                            ${bodyRows}
                        </tbody>
                    </table>
                </div>
            ` : '<div class="plugin-empty">No matching notes found for this static dataview query.</div>'}
        </div>
    `;

    const existing = block.querySelector('.plugin-rendered');
    if (existing) {
        existing.innerHTML = body;
    } else {
        const rendered = document.createElement('div');
        rendered.className = 'plugin-rendered plugin-rendered-dataview';
        rendered.innerHTML = body;
        block.appendChild(rendered);
    }

    const sourcePre = block.querySelector('pre');
    if (sourcePre) {
        sourcePre.hidden = true;
    }
}

function enhancePluginBlocks(root) {
    if (!root) return;

    const pluginBlocks = Array.from(root.querySelectorAll('.prose .plugin-block'));
    const dataviewJobs = [];

    pluginBlocks.forEach((block) => {
        const type = getPluginBlockType(block);
        const source = getPluginBlockSource(block);
        if (!type || !source) return;

        if (type === 'chart') {
            renderChartPluginBlock(block, source);
            return;
        }

        if (type === 'kanban') {
            renderKanbanPluginBlock(block, source);
            return;
        }

        if (type === 'dataview') {
            dataviewJobs.push({ block, source });
        }
    });

    if (dataviewJobs.length > 0) {
        getRuntimeNotesIndex().then((notes) => {
            dataviewJobs.forEach(({ block, source }) => {
                renderDataviewPluginBlock(block, source, notes);
            });
        });
    }
}

const CODE_COPY_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
`;

const CODE_COPIED_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 6 9 17l-5-5"></path>
    </svg>
`;

function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-1000px';
        textarea.style.left = '-1000px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject(new Error('Copy command failed'));
            }
        } catch (error) {
            reject(error);
        } finally {
            textarea.remove();
        }
    });
}

function setCodeCopyButtonState(button, state) {
    const isCopied = state === 'copied';
    button.classList.toggle('is-copied', isCopied);
    button.innerHTML = isCopied ? CODE_COPIED_ICON : CODE_COPY_ICON;
    button.setAttribute('aria-label', isCopied ? 'Code copied' : 'Copy code');
    button.title = isCopied ? 'Copied' : 'Copy code';
}

function decorateMarkdownCodeBlocks(root) {
    root.querySelectorAll('.prose pre').forEach((pre) => {
        if (pre.closest('.plugin-block')) {
            return;
        }

        const code = pre.querySelector('code');
        if (!code) {
            return;
        }

        const languageClass = Array.from(code.classList).find(className => className.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : '';
        if (language) {
            pre.dataset.language = language;
        } else {
            delete pre.dataset.language;
        }

        pre.dataset.codeCopyReady = 'true';

        let copyButton = Array.from(pre.children).find(child => child.classList?.contains('code-copy-button'));
        if (!copyButton) {
            copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.className = 'code-copy-button';
            pre.appendChild(copyButton);
        }

        setCodeCopyButtonState(copyButton, 'ready');
        copyButton.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const text = code.textContent || '';
            if (!text.trim()) {
                return;
            }

            try {
                await copyTextToClipboard(text.replace(/\n$/, ''));
                setCodeCopyButtonState(copyButton, 'copied');
                window.clearTimeout(copyButton.copyResetTimer);
                copyButton.copyResetTimer = window.setTimeout(() => {
                    setCodeCopyButtonState(copyButton, 'ready');
                }, 1600);
            } catch (error) {
                console.error('Unable to copy code block:', error);
                copyButton.setAttribute('aria-label', 'Copy failed');
                copyButton.title = 'Copy failed';
            }
        };
    });
}

function parseSimpleMermaidFlowchart(source) {
    const lines = String(source || '').split('\n').map(line => line.trim()).filter(Boolean);
    const header = lines.find(line => /^(flowchart|graph)\s+/i.test(line));
    if (!header) return null;

    const direction = (header.match(/^(?:flowchart|graph)\s+(LR|RL|TD|TB|BT)/i)?.[1] || 'TD').toUpperCase();
    const nodes = new Map();
    const edges = [];
    const ensureNode = (id, label = '') => {
        if (!nodes.has(id)) {
            nodes.set(id, {
                id,
                label: (label || id).replace(/^["']|["']$/g, '')
            });
        } else if (label) {
            nodes.get(id).label = label.replace(/^["']|["']$/g, '');
        }
    };

    lines.forEach((line) => {
        if (/^(flowchart|graph)\s+/i.test(line) || line.startsWith('%%')) return;
        const match = line.match(/^([A-Za-z0-9_-]+)(?:\[(.+?)\])?\s*[-=.]+(?:\|(.+?)\|)?[>.]+\s*([A-Za-z0-9_-]+)(?:\[(.+?)\])?/);
        if (!match) return;

        const [, fromId, fromLabel, edgeLabel, toId, toLabel] = match;
        ensureNode(fromId, fromLabel);
        ensureNode(toId, toLabel);
        edges.push({ fromId, toId, label: edgeLabel || '' });
    });

    if (nodes.size === 0 || edges.length === 0) return null;

    return {
        direction,
        nodes: Array.from(nodes.values()),
        edges
    };
}

function renderMermaidNodeLabel(label, centerX, centerY) {
    const maxLineLength = 18;
    const text = String(label || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';

    const words = text.split(' ').map((word) => (
        word.length > maxLineLength ? `${word.slice(0, maxLineLength - 3)}...` : word
    ));
    const lines = [];

    words.forEach((word) => {
        if (lines.length === 0) {
            lines.push(word);
            return;
        }

        const last = lines[lines.length - 1] || '';
        const next = last ? `${last} ${word}` : word;
        if (next.length <= maxLineLength) {
            lines[lines.length - 1] = next;
        } else if (lines.length < 2) {
            lines.push(word);
        } else {
            lines[1] = `${lines[1].slice(0, maxLineLength - 3)}...`;
        }
    });

    const visibleLines = lines.slice(0, 2);
    const firstY = centerY - ((visibleLines.length - 1) * 7) + 4;
    return `
        <text x="${centerX}" y="${firstY}" text-anchor="middle">
            ${visibleLines.map((line, index) => `<tspan x="${centerX}" dy="${index === 0 ? 0 : 14}">${escapeHtml(line)}</tspan>`).join('')}
        </text>
    `;
}

function renderSimpleMermaidFlowchart(source) {
    const chart = parseSimpleMermaidFlowchart(source);
    if (!chart) return null;

    const horizontal = chart.direction === 'LR' || chart.direction === 'RL';
    const nodeWidth = horizontal ? 132 : 168;
    const nodeHeight = 38;
    const gap = horizontal ? 44 : 24;
    const padding = 18;
    const width = horizontal
        ? padding * 2 + (chart.nodes.length * nodeWidth) + ((chart.nodes.length - 1) * gap)
        : padding * 2 + nodeWidth;
    const height = horizontal
        ? padding * 2 + nodeHeight
        : padding * 2 + (chart.nodes.length * nodeHeight) + ((chart.nodes.length - 1) * gap);

    const positions = new Map();
    chart.nodes.forEach((node, index) => {
        const x = horizontal ? padding + index * (nodeWidth + gap) : padding;
        const y = horizontal ? padding : padding + index * (nodeHeight + gap);
        positions.set(node.id, { x, y });
    });

    const markerId = `mermaid-codebase-arrow-${Math.abs(Array.from(source).reduce((hash, character) => ((hash << 5) - hash) + character.charCodeAt(0), 0))}`;
    const edgeMarkup = chart.edges.map((edge) => {
        const from = positions.get(edge.fromId);
        const to = positions.get(edge.toId);
        if (!from || !to) return '';

        const x1 = horizontal ? from.x + nodeWidth : from.x + nodeWidth / 2;
        const y1 = horizontal ? from.y + nodeHeight / 2 : from.y + nodeHeight;
        const x2 = horizontal ? to.x : to.x + nodeWidth / 2;
        const y2 = horizontal ? to.y + nodeHeight / 2 : to.y;
        const label = edge.label
            ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 8}" text-anchor="middle" class="mermaid-fallback-edge-label">${escapeHtml(edge.label)}</text>`
            : '';

        return `
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="mermaid-fallback-edge" marker-end="url(#${markerId})"></line>
            ${label}
        `;
    }).join('');

    const nodeMarkup = chart.nodes.map((node) => {
        const position = positions.get(node.id);
        return `
            <g class="mermaid-fallback-node">
                <rect x="${position.x}" y="${position.y}" width="${nodeWidth}" height="${nodeHeight}" rx="9"></rect>
                ${renderMermaidNodeLabel(node.label, position.x + nodeWidth / 2, position.y + nodeHeight / 2)}
            </g>
        `;
    }).join('');

    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="mermaid-fallback-svg mermaid-codebase-svg" role="img" aria-label="Flowchart">
            <defs>
                <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M 0 0 L 8 4 L 0 8 z" class="mermaid-fallback-arrow"></path>
                </marker>
            </defs>
            ${edgeMarkup}
            ${nodeMarkup}
        </svg>
    `;
}

function renderMermaidFallbacks(root, nodes = null) {
    const mermaidNodes = nodes || Array.from(root.querySelectorAll('.prose .mermaid'));
    mermaidNodes.forEach((node) => {
        const source = (node.dataset.source || node.textContent || '').trim();
        if (!source) return;

        const markup = renderSimpleMermaidFlowchart(source);
        if (!markup) return;

        node.dataset.source = source;
        node.dataset.rendered = 'true';
        node.dataset.renderedEngine = 'codebase';
        node.classList.add('mermaid-fallback', 'mermaid-codebase');
        node.innerHTML = markup;
    });
}

function enhanceMermaidDiagrams(root) {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral';
    const nodes = Array.from(root.querySelectorAll('.prose .mermaid'));
    if (nodes.length === 0) return;

    const nodesForMermaid = [];
    nodes.forEach((node) => {
        const source = (node.dataset.source || node.textContent || '').trim();
        if (!source) return;

        if (!node.dataset.source) {
            node.dataset.source = source;
        }

        if (node.dataset.rendered === 'true' && node.dataset.renderedEngine === 'codebase') {
            return;
        }

        const needsThemeRefresh = node.dataset.rendered === 'true'
            && node.dataset.renderedEngine !== 'codebase'
            && node.dataset.renderedTheme !== currentTheme;

        if (needsThemeRefresh && node.dataset.source) {
            node.textContent = node.dataset.source;
            node.dataset.rendered = 'false';
        }

        if (node.dataset.rendered === 'true') return;

        const compactFlowchart = renderSimpleMermaidFlowchart(source);
        if (compactFlowchart) {
            node.dataset.source = source;
            node.dataset.rendered = 'true';
            node.dataset.renderedEngine = 'codebase';
            node.classList.add('mermaid-fallback', 'mermaid-codebase');
            node.innerHTML = compactFlowchart;
            return;
        }

        nodesForMermaid.push(node);
    });

    if (nodesForMermaid.length === 0) return;

    if (!window.mermaid) {
        renderMermaidFallbacks(root, nodesForMermaid);
        return;
    }

    if (!window.__PORTFOLIO_MERMAID_READY__ || window.__PORTFOLIO_MERMAID_THEME__ !== currentTheme) {
        window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: currentTheme,
            flowchart: {
                curve: 'basis',
                htmlLabels: true,
                padding: 18,
                nodeSpacing: 52,
                rankSpacing: 58
            },
            themeVariables: {
                primaryColor: currentTheme === 'dark' ? '#162826' : '#eef8f6',
                primaryTextColor: currentTheme === 'dark' ? '#f2f6f5' : '#17211f',
                primaryBorderColor: '#0f8b8d',
                lineColor: currentTheme === 'dark' ? '#94aaa6' : '#61736f',
                fontFamily: 'IBM Plex Sans, Arial, sans-serif'
            }
        });
        window.__PORTFOLIO_MERMAID_READY__ = true;
        window.__PORTFOLIO_MERMAID_THEME__ = currentTheme;
    }

    const nodesToRender = nodesForMermaid.filter((node) => node.dataset.rendered !== 'true');

    if (nodesToRender.length === 0) return;

    window.mermaid.run({ nodes: nodesToRender })
        .then(() => {
            nodesToRender.forEach((node) => {
                node.dataset.rendered = 'true';
                node.dataset.renderedTheme = currentTheme;

                const svg = node.querySelector('svg');
                if (svg) {
                    svg.removeAttribute('height');
                    svg.style.maxWidth = '100%';
                    svg.style.height = 'auto';
                    svg.style.display = 'block';
                    svg.style.marginInline = 'auto';
                }
            });
        })
        .catch((error) => {
            console.error('Error rendering Mermaid diagram:', error);
            nodesToRender.forEach((node) => {
                if (node.dataset.source) {
                    node.textContent = node.dataset.source;
                }
            });
            renderMermaidFallbacks(root, nodesToRender);
        });
}

function enhanceRichContent(root) {
    if (!root) return;
    normalizeMarkdownTables(root);
    enhancePluginBlocks(root);
    decorateMarkdownCodeBlocks(root);
    enhanceMermaidDiagrams(root);
}

// ===========================
// Theme Management Module
// ===========================

class ThemeManager {
    constructor() {
        this.THEME_KEY = 'portfolio-theme';
        this.THEMES = {
            DARK: 'dark',
            LIGHT: 'light'
        };
        this.init();
    }

    init() {
        // Load saved theme or default to light for the editorial layout
        const savedTheme = this.getSavedTheme();
        this.setTheme(savedTheme);
        this.setupToggleButton();
    }

    getSavedTheme() {
        return localStorage.getItem(this.THEME_KEY) || this.THEMES.LIGHT;
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.THEME_KEY, theme);
        this.updateToggleButton(theme);
        // Swap the highlight.js stylesheet to match the new theme
        const hljsLink = document.getElementById('hljs-theme');
        if (hljsLink) {
            const hljsTheme = theme === this.THEMES.DARK ? 'github-dark' : 'github';
            hljsLink.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/${hljsTheme}.min.css`;
        }
        enhanceRichContent(document);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.setTheme(newTheme);
    }

    setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    updateToggleButton(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.theme-icon');
            const label = toggleBtn.querySelector('.theme-label');
            const isDark = theme === this.THEMES.DARK;
            if (icon) {
                icon.textContent = isDark ? '☀' : '◐';
            }
            if (label) {
                label.textContent = isDark ? 'Light mode' : 'Dark mode';
            }
            const actionLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
            toggleBtn.setAttribute('aria-label', actionLabel);
            toggleBtn.setAttribute('title', actionLabel);
        }
    }
}

// ===========================
// Filter Panel Module
// ===========================

class FilterPanel {
    constructor() {
        this.panel = null;
        this.overlay = null;
        this.toggleBtn = null;
        this.closeBtn = null;
        this.isOpen = false;
    }

    init() {
        this.panel = document.getElementById('filter-panel');
        this.overlay = document.getElementById('filter-overlay');
        this.toggleBtn = document.getElementById('filter-toggle-btn');
        this.closeBtn = document.getElementById('filter-close-btn');

        if (!this.panel || !this.overlay || !this.toggleBtn || !this.closeBtn) {
            console.warn('Filter panel elements not found');
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Open panel
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate close from document click
            this.open();
        });

        // Close panel
        this.closeBtn.addEventListener('click', () => this.close());

        // Close on overlay click
        this.overlay.addEventListener('click', () => this.close());

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close when clicking outside the panel
        document.addEventListener('click', (e) => {
            if (this.isOpen) {
                // Check if click is outside the panel
                const isClickInsidePanel = this.panel.contains(e.target);
                const isClickOnToggleBtn = this.toggleBtn.contains(e.target);

                // Close if clicked outside panel and not on toggle button
                if (!isClickInsidePanel && !isClickOnToggleBtn) {
                    this.close();
                }
            }
        });

        // Prevent clicks inside panel from closing it
        this.panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open() {
        this.panel.classList.add('active');
        this.overlay.classList.add('active');
        this.isOpen = true;

        // Only prevent scrolling on mobile (when overlay is visible)
        if (window.innerWidth < 1200) {
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        this.panel.classList.remove('active');
        this.overlay.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = ''; // Restore scrolling

        // Note: Filter selections are preserved - they remain active even when panel closes
        // The BlogSystem maintains the selected categories and tags state
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}

// ===========================
// Blog System Module
// ===========================

class BlogSystem {
    constructor(configManager = null) {
        this.posts = [];
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/blog-files.json';
        this.playlistApiEndpoint = '/api-static/playlist-files.json';
        this.activePlaylist = null;
        this.selectedCategories = new Set();
        this.selectedTags = new Set();
        this.allTags = new Map();
        this.availableCategories = [];
        // Pagination
        this._page = 0;
        this._pageSize = 20;
        this._filteredCache = null;
    }

    /**
     * Fetch all markdown files from the blog directory via API
     * Automatically discovers all .md files (excluding templates starting with _)
     */
    async fetchBlogFiles() {
        // In-memory cache — skip network on repeated calls within the same page session
        if (BlogSystem._cache) return BlogSystem._cache;
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) throw new Error('Failed to fetch blog files');
            const data = await response.json();
            BlogSystem._cache = data.files;
            return BlogSystem._cache;
        } catch (error) {
            console.error('Error fetching blog files:', error);
            return [];
        }
    }

    async fetchPlaylistFiles() {
        if (BlogSystem._playlistCache) return BlogSystem._playlistCache;
        try {
            const response = await fetch(this.playlistApiEndpoint);
            if (!response.ok) throw new Error('Failed to fetch playlist files');
            const data = await response.json();
            BlogSystem._playlistCache = Array.isArray(data.files) ? data.files : [];
            return BlogSystem._playlistCache;
        } catch (error) {
            console.warn('Playlist data unavailable:', error);
            return [];
        }
    }

    async loadActivePlaylist(postId, playlistId) {
        this.activePlaylist = null;
        if (!playlistId) return null;

        const playlists = await this.fetchPlaylistFiles();
        const playlist = playlists.find(item => item.id === playlistId);
        const containsPost = playlist?.posts?.some(post => post.id === postId);

        if (playlist && containsPost) {
            this.activePlaylist = playlist;
        }

        return this.activePlaylist;
    }

    async loadPostsFromFiles() {
        // Fetch bundled blog data (pre-parsed during build)
        const blogFiles = await this.fetchBlogFiles();

        // Reset tags
        this.allTags.clear();
        const categories = new Set();

        this.posts = blogFiles.map(post => {
            categories.add(post.category || 'general');
            // Collect tags for filtering
            if (Array.isArray(post.tags) && post.tags.length > 0) {
                post.tags.forEach(tag => {
                    if (!this.allTags.has(tag)) {
                        this.allTags.set(tag, new Set());
                    }
                    this.allTags.get(tag).add(post.category || 'general');
                });
            }
            return post;
        });

        this.availableCategories = Array.from(categories).sort((a, b) => a.localeCompare(b));

        return this.posts;
    }

    parseFrontmatter(content, filename, category) {
        // Check if content starts with frontmatter (---)
        if (!content.startsWith('---')) {
            return null;
        }

        // Extract frontmatter
        const parts = content.split('---');
        if (parts.length < 3) {
            return null;
        }

        const frontmatterText = parts[1].trim();
        const markdownContent = parts.slice(2).join('---');

        // Parse frontmatter (simple YAML parser)
        const frontmatter = {};
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
            else if (value === 'true') value = true;
            else if (value === 'false') value = false;

            frontmatter[key] = value;
        }

        // Create post object
        // Extract just the filename without path
        const filenameParts = filename.split('/');
        const id = filenameParts[filenameParts.length - 1].replace('.md', '');

        return {
            id,
            title: frontmatter.title || 'Untitled',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            readingTime: frontmatter.readingTime || '5 min read',
            excerpt: frontmatter.excerpt || '',
            tags: frontmatter.tags || [],
            published: frontmatter.published || false,
            category: category, // tech, non-tech, or general
            file: `blog/${filename}`,
            content: markdownContent
        };
    }

    async loadBlogList() {
        const blogListContainer = document.getElementById('blog-list');
        if (!blogListContainer) return;

        // Load posts from markdown files
        await this.loadPostsFromFiles();

        // Render and setup filters
        this.renderCategoryFilters();
        this.setupCategoryFilters();
        this.setupTagFilters();

        // Initialize tag filters display
        this.updateTagFilters();

        // Initial render
        this.renderFilteredPosts();
    }

    getCategoryPalette(category) {
        return getSharedCategoryPalette(category);
    }

    getCategoryStyle(category) {
        return getSharedCategoryStyle(category);
    }

    renderCategoryFilters() {
        const categoryFiltersContainer = document.getElementById('category-filters');
        if (!categoryFiltersContainer) return;

        if (this.availableCategories.length === 0) {
            categoryFiltersContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No categories available</p>';
            return;
        }

        categoryFiltersContainer.innerHTML = this.availableCategories.map(category => `
            <label class="category-filter-label" style="${this.getCategoryStyle(category)}">
                <input type="checkbox" class="category-filter" data-category="${escapeHtml(category)}">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">${escapeHtml(category)}</span>
            </label>
        `).join('');
    }

    setupCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('.category-filter');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = e.target.dataset.category;
                if (e.target.checked) {
                    this.selectedCategories.add(category);
                } else {
                    this.selectedCategories.delete(category);
                }
                this.updateTagFilters();
                this.renderFilteredPosts();
            });
        });
    }

    setupTagFilters() {
        // This will be called after rendering tag filters
        const updateTagListeners = () => {
            const tagButtons = document.querySelectorAll('.tag-filter-btn');
            tagButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tag = e.target.dataset.tag;
                    if (this.selectedTags.has(tag)) {
                        this.selectedTags.delete(tag);
                        e.target.classList.remove('active');
                    } else {
                        this.selectedTags.add(tag);
                        e.target.classList.add('active');
                    }
                    this.renderFilteredPosts();
                });
            });
        };

        // Clear all button
        const clearBtn = document.getElementById('clear-tags-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.selectedTags.clear();
                document.querySelectorAll('.tag-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.renderFilteredPosts();
            });
        }

        // Initial setup
        updateTagListeners();

        // Store for later use
        this.updateTagListeners = updateTagListeners;
    }

    updateTagFilters() {
        const tagFiltersContainer = document.getElementById('tag-filters');
        if (!tagFiltersContainer) return;

        // Determine which tags to show based on selected categories
        let tagsToShow = [];

        if (this.selectedCategories.size === 0) {
            // No category selected - show all tags
            tagsToShow = Array.from(this.allTags.keys());
        } else {
            // Show only tags from selected categories
            this.allTags.forEach((categories, tag) => {
                for (let selectedCat of this.selectedCategories) {
                    if (categories.has(selectedCat)) {
                        tagsToShow.push(tag);
                        break;
                    }
                }
            });
        }

        // Sort tags alphabetically
        tagsToShow.sort();

        // Render tag filter buttons
        if (tagsToShow.length === 0) {
            tagFiltersContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No tags available</p>';
        } else {
            tagFiltersContainer.innerHTML = tagsToShow.map(tag => {
                const isActive = this.selectedTags.has(tag);
                return `<button class="tag-filter-btn ${isActive ? 'active' : ''}" data-tag="${tag}">${tag}</button>`;
            }).join('');

            // Reattach event listeners
            if (this.updateTagListeners) {
                this.updateTagListeners();
            }
        }
    }

    getFilteredPosts() {
        let filtered = [...this.posts];

        // Filter by category (if any selected)
        if (this.selectedCategories.size > 0) {
            filtered = filtered.filter(post =>
                this.selectedCategories.has(post.category)
            );
        }

        // Filter by tags (if any selected) - show posts with ANY of the selected tags
        if (this.selectedTags.size > 0) {
            filtered = filtered.filter(post =>
                Array.isArray(post.tags) && post.tags.some(tag => this.selectedTags.has(tag))
            );
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    }

    renderFilteredPosts() {
        const container = document.getElementById('blog-list');
        if (!container) return;

        // Reset pagination whenever filters change
        this._page = 0;
        this._filteredCache = this.getFilteredPosts();

        const countEl = document.getElementById('posts-count');
        if (countEl) {
            countEl.textContent = `Showing ${this._filteredCache.length} post${this._filteredCache.length !== 1 ? 's' : ''}`;
        }

        container.innerHTML = '';

        if (this._filteredCache.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:var(--spacing-xl);color:var(--text-secondary)">
                    <p>No posts found matching your filters.</p>
                    <p style="margin-top:var(--spacing-md);font-size:.9rem">Try selecting different categories or tags.</p>
                </div>`;
            return;
        }

        this._appendPage(container);
    }

    _appendPage(container) {
        const start = this._page * this._pageSize;
        const slice = this._filteredCache.slice(start, start + this._pageSize);
        if (slice.length === 0) return;

        const frag = document.createDocumentFragment();
        slice.forEach(post => frag.appendChild(this.createBlogCard(post)));
        container.appendChild(frag);
        this._page++;

        // Remove existing Load More button before re-evaluating
        const old = document.getElementById('blog-load-more');
        if (old) old.remove();

        const hasMore = this._page * this._pageSize < this._filteredCache.length;
        if (hasMore) {
            const btn = document.createElement('button');
            btn.id = 'blog-load-more';
            btn.className = 'home-action';
            btn.style.cssText = 'display:block;margin:2rem auto 0;padding:.9rem 2.4rem';
            btn.textContent = `Load more (${this._filteredCache.length - this._page * this._pageSize} remaining)`;
            btn.addEventListener('click', () => this._appendPage(container));
            container.after(btn);
        }
    }

    createBlogCard(post) {
        try {
            const showCategories = this.configManager?.getSiteConfig('blog_show_categories') !== false;
            const showReadingTime = this.configManager?.getSiteConfig('blog_show_reading_time') !== false;
            const showExcerpts = this.configManager?.getSiteConfig('blog_show_excerpts') !== false;
            const showTags = this.configManager?.getSiteConfig('blog_show_tags') !== false;
            const card = document.createElement('article');
            card.className = 'blog-card';
            const postHref = buildDetailPath('blog-post', post.id);
            card.onclick = () => window.location.href = postHref;
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.location.href = postHref;
                }
            });

            const categoryBadge = showCategories ? this.getCategoryBadge(post.category) : '';
            const metaItems = [`<span class="blog-card-date">${this.formatDate(post.date)}</span>`];
            if (showReadingTime && post.readingTime) {
                metaItems.push(`<span class="blog-card-reading-time">${post.readingTime || CONFIG.DEFAULT_READING_TIME}</span>`);
            }

            const tagsHTML = showTags && Array.isArray(post.tags) && post.tags.length > 0
                ? `<div class="blog-card-tags">${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>`
                : '';

            card.innerHTML = `
                <div class="blog-card-header">
                    <div class="blog-card-topline">
                        ${categoryBadge}
                        <div class="blog-card-meta">
                            ${metaItems.join('')}
                        </div>
                    </div>
                    <h2 class="blog-card-title">
                        <a href="${postHref}">${post.title}</a>
                    </h2>
                    ${showExcerpts && post.excerpt ? `<p class="blog-card-excerpt">${post.excerpt}</p>` : ''}
                    <div class="blog-card-footer">
                        ${tagsHTML}
                        <a href="${postHref}" class="card-inline-action">Read note</a>
                    </div>
                </div>
            `;

            return card;
        } catch (error) {
            console.error('Error creating blog card:', error);
            // Return empty card on error
            const errorCard = document.createElement('article');
            errorCard.className = 'blog-card';
            errorCard.innerHTML = '<p style="color: var(--text-secondary);">Error loading post</p>';
            return errorCard;
        }
    }

    getCategoryBadge(category) {
        return renderSharedCategoryBadge(category);
    }

    async loadBlogPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = getUrlDetailId('blog-post');

        if (!postId) {
            window.location.href = 'blog.html';
            return;
        }

        // Load posts from markdown files first
        await this.loadPostsFromFiles();

        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            window.location.href = 'blog.html';
            return;
        }

        await this.loadActivePlaylist(postId, urlParams.get('playlist'));
        this.updatePageMeta(post);

        try {
            let html = post.html || '';

            if (!html && post.content) {
                html = await this.markdownParser.parse(post.content);
            }

            if (!html) {
                const response = await fetch(post.file);
                const rawContent = await response.text();
                const parsedPost = this.parseFrontmatter(rawContent, post.id, post.category);
                html = await this.markdownParser.parse(parsedPost.content);
            }

            this.renderBlogPost(post, html);

        } catch (error) {
            console.error('Error loading blog post:', error);
            this.renderError();
        }
    }

    updatePageMeta(post) {
        const siteName = this.configManager?.getSiteName() || 'Portfolio';
        const pagePath = buildDetailPath('blog-post', post.id);
        const canonicalUrl = buildRuntimeUrl(this.configManager, pagePath);
        const author = buildRuntimePersonSchema(this.configManager);

        updateRuntimeSeo({
            configManager: this.configManager,
            title: `${post.title} | ${siteName}`,
            description: post.excerpt,
            pagePath,
            type: 'article',
            schema: {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: truncateSeoText(post.excerpt),
                datePublished: post.date,
                dateModified: post.updated || post.date,
                author,
                publisher: author,
                mainEntityOfPage: canonicalUrl,
                url: canonicalUrl,
                articleSection: post.category,
                keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined
            }
        });
    }

    renderBlogPost(post, html) {
        const container = document.getElementById('blog-post-container');
        if (!container) return;

        const showCategories = this.configManager?.getSiteConfig('blog_show_categories') !== false;
        const showReadingTime = this.configManager?.getSiteConfig('blog_show_reading_time') !== false;
        const showTags = this.configManager?.getSiteConfig('blog_show_tags') !== false;
        const tagsHTML = showTags && Array.isArray(post.tags) && post.tags.length > 0
            ? `<div class="blog-card-tags">${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>`
            : '';

        const metaItems = [`<span>${this.formatDate(post.date)}</span>`];
        if (showReadingTime && post.readingTime) {
            metaItems.push(`<span>${post.readingTime}</span>`);
        }

        container.innerHTML = `
            <article class="blog-post">
                <header class="blog-post-header">
                    <div class="blog-post-kicker">
                        ${showCategories ? this.getCategoryBadge(post.category) : ''}
                        <span class="blog-post-divider">Published ${this.formatDate(post.date)}</span>
                    </div>
                    <h1 class="blog-post-title">${post.title}</h1>
                    ${post.excerpt ? `<p class="blog-post-lead">${post.excerpt}</p>` : ''}
                    <div class="blog-post-meta">${metaItems.join('')}</div>
                    ${tagsHTML}
                </header>
                ${this.renderPlaylistContext(post)}
                <div class="blog-post-content prose">
                    ${html}
                </div>
                ${this.renderBlogNavigation(post)}
                <footer class="detail-back-row">
                    ${this.renderBlogBackLink()}
                </footer>
            </article>
        `;

        enhanceRichContent(container);
    }

    renderPlaylistContext(currentPost) {
        const playlist = this.activePlaylist;
        if (!playlist || !Array.isArray(playlist.posts)) return '';

        const currentIndex = playlist.posts.findIndex(post => post.id === currentPost.id);
        if (currentIndex === -1) return '';

        const playlistUrl = buildDetailPath('playlist-detail', playlist.id);
        const count = playlist.posts.length;

        return `
            <aside class="playlist-context" aria-label="Playlist context">
                <div class="playlist-context-copy">
                    <span class="playlist-context-eyebrow">Playlist</span>
                    <a href="${playlistUrl}" class="playlist-context-title">${escapeHtml(playlist.title)}</a>
                    <span class="playlist-context-progress">Part ${currentIndex + 1} of ${count}</span>
                </div>
                <a href="${playlistUrl}" class="playlist-context-action">View playlist</a>
            </aside>
        `;
    }

    renderBlogBackLink() {
        if (this.activePlaylist) {
            const playlistUrl = buildDetailPath('playlist-detail', this.activePlaylist.id);
            return `<a href="${playlistUrl}" class="back-link">← Back to ${escapeHtml(this.activePlaylist.title)}</a>`;
        }

        return '<a href="blog.html" class="back-link">← Back to Blog</a>';
    }

    renderBlogNavigation(currentPost) {
        const playlist = this.activePlaylist;
        const usingPlaylist = playlist && Array.isArray(playlist.posts) &&
            playlist.posts.some(post => post.id === currentPost.id);
        const sortedPosts = usingPlaylist
            ? playlist.posts
            : [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        const currentIndex = sortedPosts.findIndex(p => p.id === currentPost.id);
        if (currentIndex === -1) return '';

        const nextPost = usingPlaylist
            ? (currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null)
            : (currentIndex > 0 ? sortedPosts[currentIndex - 1] : null);
        const prevPost = usingPlaylist
            ? (currentIndex > 0 ? sortedPosts[currentIndex - 1] : null)
            : (currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null);
        const hrefForPost = (post) => {
            if (usingPlaylist) {
                return buildDetailPath('blog-post', post.id, { playlist: playlist.id });
            }
            return buildDetailPath('blog-post', post.id);
        };
        const previousLabel = usingPlaylist ? 'Previous in playlist' : 'Older post';
        const nextLabel = usingPlaylist ? 'Next in playlist' : 'Newer post';
        const previousEmpty = usingPlaylist ? 'Start of playlist' : 'No older post';
        const nextEmpty = usingPlaylist ? 'End of playlist' : 'No newer post';

        const previousButton = prevPost
            ? `
                <a href="${hrefForPost(prevPost)}" class="blog-nav-link prev">
                    <span class="blog-nav-icon">←</span>
                    <div class="blog-nav-content">
                        <span class="blog-nav-label">${previousLabel}</span>
                        <span class="blog-nav-title">${escapeHtml(prevPost.title)}</span>
                    </div>
                </a>
            `
            : `
                <span class="blog-nav-link prev disabled" aria-disabled="true">
                    <span class="blog-nav-icon">←</span>
                    <div class="blog-nav-content">
                        <span class="blog-nav-label">${previousLabel}</span>
                        <span class="blog-nav-title">${previousEmpty}</span>
                    </div>
                </span>
            `;

        const nextButton = nextPost
            ? `
                <a href="${hrefForPost(nextPost)}" class="blog-nav-link next">
                    <div class="blog-nav-content">
                        <span class="blog-nav-label">${nextLabel}</span>
                        <span class="blog-nav-title">${escapeHtml(nextPost.title)}</span>
                    </div>
                    <span class="blog-nav-icon">→</span>
                </a>
            `
            : `
                <span class="blog-nav-link next disabled" aria-disabled="true">
                    <div class="blog-nav-content">
                        <span class="blog-nav-label">${nextLabel}</span>
                        <span class="blog-nav-title">${nextEmpty}</span>
                    </div>
                    <span class="blog-nav-icon">→</span>
                </span>
            `;

        return `
            <nav class="blog-post-navigation">
                ${previousButton}
                ${nextButton}
            </nav>
        `;
    }

    renderError() {
        const container = document.getElementById('blog-post-container');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl);">
                <h2>Post not found</h2>
                <p style="color: var(--text-secondary); margin-top: var(--spacing-md);">
                    The blog post you're looking for doesn't exist or couldn't be loaded.
                </p>
                <a href="blog.html" class="inline-link" style="margin-top: var(--spacing-md); display: inline-block;">
                    ← Back to blog
                </a>
            </div>
        `;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// ===========================
// Playlist System Module
// ===========================

class PlaylistSystem {
    constructor(configManager = null) {
        this.playlists = [];
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/playlist-files.json';
    }

    async fetchPlaylistFiles() {
        if (PlaylistSystem._cache) return PlaylistSystem._cache;

        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) throw new Error('Failed to fetch playlist files');
            const data = await response.json();
            PlaylistSystem._cache = Array.isArray(data.files) ? data.files : [];
            return PlaylistSystem._cache;
        } catch (error) {
            console.error('Error fetching playlist files:', error);
            return [];
        }
    }

    async loadPlaylistsFromFiles() {
        this.playlists = await this.fetchPlaylistFiles();
        return this.playlists;
    }

    async loadPlaylistList() {
        const container = document.getElementById('playlists-grid');
        if (!container) return;

        await this.loadPlaylistsFromFiles();
        this.renderPlaylistList();
    }

    renderPlaylistList() {
        const container = document.getElementById('playlists-grid');
        const countEl = document.getElementById('playlists-count');
        if (!container) return;

        if (countEl) {
            countEl.textContent = `${this.playlists.length} playlist${this.playlists.length !== 1 ? 's' : ''}`;
        }

        if (this.playlists.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No playlists yet</h2>
                    <p>Add markdown files in the playlists folder to create ordered reading paths.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        this.playlists.forEach(playlist => {
            fragment.appendChild(this.createPlaylistCard(playlist));
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('article');
        const url = buildDetailPath('playlist-detail', playlist.id);
        card.className = 'playlist-card';
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.onclick = () => window.location.href = url;
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = url;
            }
        });

        const previewPosts = Array.isArray(playlist.posts) ? playlist.posts.slice(0, 3) : [];
        const coverUrl = playlist.cover
            ? this.configManager?.replaceVariables(playlist.cover) || playlist.cover
            : '';
        const visualMark = this.createPlaylistMark(playlist.title);
        const coverHTML = `
            <div class="playlist-card-media${coverUrl ? '' : ' playlist-card-media--fallback'}">
                ${coverUrl ? `<img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(playlist.title)}" class="playlist-card-image" loading="lazy" onerror="const wrapper=this.closest('.playlist-card-media'); wrapper.classList.add('playlist-card-media--fallback'); this.remove();">` : ''}
                <span class="playlist-card-mark" aria-hidden="true">${escapeHtml(visualMark)}</span>
            </div>
        `;
        const postPreviewHTML = previewPosts.length > 0
            ? `
                <ol class="playlist-card-posts">
                    ${previewPosts.map(post => `<li>${escapeHtml(post.title)}</li>`).join('')}
                </ol>
            `
            : '<p class="playlist-card-empty">No posts have been added yet.</p>';

        card.innerHTML = `
            ${coverHTML}
            <div class="playlist-card-body">
                <div class="playlist-card-meta">
                    <span>${playlist.count || 0} post${playlist.count === 1 ? '' : 's'}</span>
                </div>
                <h2 class="playlist-card-title">
                    <a href="${url}">${escapeHtml(playlist.title)}</a>
                </h2>
                ${playlist.description ? `<p class="playlist-card-description">${escapeHtml(playlist.description)}</p>` : ''}
                ${postPreviewHTML}
                <div class="playlist-card-footer">
                    <a href="${url}" class="project-link">Open playlist</a>
                </div>
            </div>
        `;

        return card;
    }

    async loadPlaylistDetail() {
        const container = document.getElementById('playlist-detail-container');
        if (!container) return;

        const playlistId = getUrlDetailId('playlist-detail');
        if (!playlistId) {
            window.location.href = 'playlists.html';
            return;
        }

        await this.loadPlaylistsFromFiles();
        const playlist = this.playlists.find(item => item.id === playlistId);
        if (!playlist) {
            window.location.href = 'playlists.html';
            return;
        }

        this.updatePageMeta(playlist);

        const bodyHTML = playlist.html || (playlist.content
            ? await this.markdownParser.parse(playlist.content)
            : '');
        this.renderPlaylistDetail(playlist, bodyHTML);
    }

    updatePageMeta(playlist) {
        const siteName = this.configManager?.getSiteName() || 'Portfolio';
        const pagePath = buildDetailPath('playlist-detail', playlist.id);
        const canonicalUrl = buildRuntimeUrl(this.configManager, pagePath);
        const posts = Array.isArray(playlist.posts) ? playlist.posts : [];

        updateRuntimeSeo({
            configManager: this.configManager,
            title: `${playlist.title} | ${siteName}`,
            description: playlist.description || 'Curated blog playlist.',
            pagePath,
            image: playlist.cover,
            schema: {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: playlist.title,
                description: truncateSeoText(playlist.description || 'Curated blog playlist.'),
                url: canonicalUrl,
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: posts.length,
                    itemListElement: posts.map((post, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: post.title,
                        url: post.id ? buildRuntimeUrl(this.configManager, buildDetailPath('blog-post', post.id)) : undefined
                    }))
                }
            }
        });
    }

    renderPlaylistDetail(playlist, bodyHTML = '') {
        const container = document.getElementById('playlist-detail-container');
        if (!container) return;

        const posts = Array.isArray(playlist.posts) ? playlist.posts : [];
        const coverUrl = playlist.cover
            ? this.configManager?.replaceVariables(playlist.cover) || playlist.cover
            : '';
        const visualMark = this.createPlaylistMark(playlist.title);
        const coverHTML = `
            <div class="playlist-detail-media${coverUrl ? '' : ' playlist-detail-media--fallback'}">
                ${coverUrl ? `<img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(playlist.title)}" class="playlist-detail-image" loading="lazy" onerror="const wrapper=this.closest('.playlist-detail-media'); wrapper.classList.add('playlist-detail-media--fallback'); this.remove();">` : ''}
                <span class="playlist-card-mark" aria-hidden="true">${escapeHtml(visualMark)}</span>
            </div>
        `;
        const bodyBlock = bodyHTML
            ? `<div class="playlist-detail-body prose">${bodyHTML}</div>`
            : '';
        const postList = posts.length > 0
            ? `
                <ol class="playlist-post-list">
                    ${posts.map((post, index) => this.renderPlaylistPost(post, playlist.id, index)).join('')}
                </ol>
            `
            : `
                <div class="empty-state">
                    <h2>No posts in this playlist</h2>
                    <p>Add post ids to the playlist markdown frontmatter to build this series.</p>
                </div>
            `;

        container.innerHTML = `
            <article class="playlist-detail">
                <div class="detail-back-row">
                    <a href="playlists.html" class="back-link">← Back to Playlists</a>
                </div>
                <header class="playlist-detail-header">
                    <div class="playlist-detail-hero">
                        <div class="playlist-detail-copy">
                            <div class="playlist-detail-meta">
                                <span class="page-chip">Playlist</span>
                                <span>${posts.length} post${posts.length === 1 ? '' : 's'}</span>
                            </div>
                            <h1 class="playlist-detail-title">${escapeHtml(playlist.title)}</h1>
                            ${playlist.description ? `<p class="playlist-detail-description">${escapeHtml(playlist.description)}</p>` : ''}
                        </div>
                        ${coverHTML}
                    </div>
                    ${bodyBlock}
                </header>
                <section class="playlist-post-section" aria-label="Playlist posts">
                    ${postList}
                </section>
            </article>
        `;

        enhanceRichContent(container);
    }

    createPlaylistMark(title = 'Playlist') {
        return title
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase() || '')
            .join('') || 'PL';
    }

    renderPlaylistPost(post, playlistId, index) {
        const url = this.createPostUrl(post, playlistId);
        const meta = [
            post.date ? this.formatDate(post.date) : '',
            post.readingTime || ''
        ].filter(Boolean);
        const tagsHTML = Array.isArray(post.tags) && post.tags.length > 0
            ? `<div class="blog-card-tags">${post.tags.slice(0, 4).map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}</div>`
            : '';

        return `
            <li class="playlist-post-item">
                <a href="${url}" class="playlist-post-link">
                    <span class="playlist-post-number">${String(index + 1).padStart(2, '0')}</span>
                    <span class="playlist-post-content">
                        <span class="playlist-post-title">${escapeHtml(post.title)}</span>
                        ${post.excerpt ? `<span class="playlist-post-excerpt">${escapeHtml(post.excerpt)}</span>` : ''}
                        ${meta.length ? `<span class="playlist-post-meta">${meta.map(item => escapeHtml(item)).join(' · ')}</span>` : ''}
                        ${tagsHTML}
                    </span>
                    <span class="playlist-post-arrow" aria-hidden="true">→</span>
                </a>
            </li>
        `;
    }

    createPostUrl(post, playlistId) {
        return buildDetailPath('blog-post', post.id, { playlist: playlistId });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

// ===========================
// Project System Module
// ===========================

function isSafeProjectLinkUrl(url) {
    const value = String(url || '').trim();
    return value && !/^(javascript|data|vbscript):/i.test(value);
}

function isExternalProjectLinkUrl(url) {
    return /^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url);
}

function parseProjectLinkEntries(source, fallbackLabel = 'Link') {
    if (!source) return [];

    const items = Array.isArray(source)
        ? source
        : String(source).split(',').map(item => item.trim()).filter(Boolean);

    return items.map(item => {
        if (item && typeof item === 'object') {
            const url = item.url || item.href || item.link || '';
            const label = item.label || item.title || item.name || fallbackLabel;
            return { label, url };
        }

        const parts = String(item).split('|').map(part => part.trim());
        if (parts.length >= 2) {
            return { label: parts[0] || fallbackLabel, url: parts.slice(1).join('|') };
        }

        return { label: fallbackLabel, url: parts[0] || '' };
    });
}

function getProjectLinks(project) {
    const fixedLinks = [
        { label: 'GitHub', url: project.githubUrl },
        { label: 'Live Demo', url: project.liveUrl },
        { label: 'Demo', url: project.demoUrl }
    ];

    const customLinks = [
        project.links,
        project.projectLinks,
        project.externalLinks
    ].flatMap(source => parseProjectLinkEntries(source));

    const seen = new Set();
    return [...fixedLinks, ...customLinks]
        .map(link => ({
            label: String(link.label || 'Link').trim(),
            url: String(link.url || '').trim()
        }))
        .filter(link => {
            if (!isSafeProjectLinkUrl(link.url)) return false;
            const key = link.url.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function renderProjectLink(link, className) {
    const targetAttrs = isExternalProjectLinkUrl(link.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escapeHtml(link.url)}" class="${className}"${targetAttrs}>${escapeHtml(link.label)}</a>`;
}

function getSharedCategoryPalette(category) {
    const source = (category || 'general').toLowerCase();
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
        hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return {
        accentLight: `hsl(${hue} 58% 38%)`,
        backgroundLight: `hsl(${hue} 72% 96%)`,
        borderLight: `hsl(${hue} 38% 82%)`,
        accentDark: `hsl(${hue} 76% 74%)`,
        backgroundDark: `hsl(${hue} 42% 18% / 0.55)`,
        borderDark: `hsl(${hue} 58% 52% / 0.34)`
    };
}

function getSharedCategoryStyle(category) {
    const palette = getSharedCategoryPalette(category);
    return [
        `--category-accent-light:${palette.accentLight}`,
        `--category-bg-light:${palette.backgroundLight}`,
        `--category-border-light:${palette.borderLight}`,
        `--category-accent-dark:${palette.accentDark}`,
        `--category-bg-dark:${palette.backgroundDark}`,
        `--category-border-dark:${palette.borderDark}`
    ].join(';') + ';';
}

function renderSharedCategoryBadge(category) {
    const safeCategory = escapeHtml(category || 'general');
    return `<span class="category-badge" style="${getSharedCategoryStyle(category)}">${safeCategory}</span>`;
}

class ProjectSystem {
    constructor(configManager = null) {
        this.projects = [];
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/project-files.json';
        this.selectedCategories = new Set();
        this.selectedTags = new Set();
        this.allTags = new Map();
        this.availableCategories = [];
    }

    /**
     * Fetch all markdown files from the projects directory via API
     * Automatically discovers all .md files (excluding templates starting with _)
     */
    async fetchProjectFiles() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch project files');
            }
            const data = await response.json();
            return data.files;
        } catch (error) {
            console.error('Error fetching project files:', error);
            return [];
        }
    }

    async loadProjectsFromFiles() {
        // Fetch bundled projects data (pre-parsed during build)
        const projectsData = await this.fetchProjectFiles();
        this.projects = this.configManager?.getSiteConfig('projects_show_featured_only')
            ? projectsData.filter(project => project.featured)
            : projectsData;
        this.rebuildProjectTaxonomy();
        return this.projects;
    }

    rebuildProjectTaxonomy() {
        this.allTags.clear();
        const categories = new Set();

        this.projects = this.projects.map(project => {
            const category = project.category || 'general';
            categories.add(category);

            if (Array.isArray(project.technologies)) {
                project.technologies.forEach(tag => {
                    if (!this.allTags.has(tag)) {
                        this.allTags.set(tag, new Set());
                    }
                    this.allTags.get(tag).add(category);
                });
            }

            return { ...project, category };
        });

        this.availableCategories = Array.from(categories).sort((a, b) => a.localeCompare(b));
    }

    parseFrontmatter(content, filename) {
        // Check if content starts with frontmatter (---)
        if (!content.startsWith('---')) {
            return null;
        }

        // Extract frontmatter
        const parts = content.split('---');
        if (parts.length < 3) {
            return null;
        }

        const frontmatterText = parts[1].trim();
        const markdownContent = parts.slice(2).join('---');

        // Parse frontmatter (simple YAML parser)
        const frontmatter = {};
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
            else if (value === 'true') value = true;
            else if (value === 'false') value = false;

            frontmatter[key] = value;
        }

        // Create project object
        const id = filename.replace('.md', '');

        // Replace image variables in frontmatter values if config manager is available
        let imageValue = frontmatter.image || 'assets/images/default-project.jpg';
        if (this.configManager && this.configManager.imageConfigLoaded) {
            imageValue = this.configManager.replaceVariables(imageValue);
        }

        return {
            id,
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            image: imageValue,
            category: frontmatter.category || 'general',
            technologies: frontmatter.technologies || [],
            githubUrl: frontmatter.githubUrl || '',
            liveUrl: frontmatter.liveUrl || '',
            demoUrl: frontmatter.demoUrl || '',
            links: frontmatter.links || frontmatter.projectLinks || frontmatter.externalLinks || [],
            published: frontmatter.published || false,
            featured: frontmatter.featured || false,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            file: `projects/${filename}`,
            content: markdownContent
        };
    }

    async loadProjectsList() {
        const projectsContainer = document.getElementById('projects-grid');
        if (!projectsContainer) return;

        // Load projects from markdown files
        await this.loadProjectsFromFiles();

        if (this.projects.length === 0) {
            projectsContainer.innerHTML = '<p style="color: var(--text-secondary);">No published projects yet.</p>';
            return;
        }

        // Initialize filter state
        this.selectedCategories = new Set();
        this.selectedTags = new Set();

        if (this.configManager?.isFeatureEnabled('project_tags')) {
            this.setupProjectFilterPanel();
            this.renderProjectCategoryFilters();
            this.setupProjectCategoryFilters();
            this.setupProjectTagFilters();
            this.updateProjectTagFilters();
        } else {
            const toggleBtn = document.getElementById('project-filter-toggle-btn');
            const panel = document.getElementById('project-filter-panel');
            const overlay = document.getElementById('project-filter-overlay');
            if (toggleBtn) toggleBtn.style.display = 'none';
            if (panel) panel.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        }

        // Render filtered projects
        this.renderFilteredProjects();
    }

    setupProjectFilterPanel() {
        const filterPanel = document.getElementById('project-filter-panel');
        const filterOverlay = document.getElementById('project-filter-overlay');
        const toggleBtn = document.getElementById('project-filter-toggle-btn');
        const closeBtn = document.getElementById('project-filter-close-btn');

        if (!filterPanel || !toggleBtn) return;

        // Toggle filter panel
        toggleBtn.addEventListener('click', () => {
            filterPanel.classList.toggle('active');
            if (filterOverlay) filterOverlay.classList.toggle('active');
        });

        // Close filter panel
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                filterPanel.classList.remove('active');
                if (filterOverlay) filterOverlay.classList.remove('active');
            });
        }

        // Close on overlay click
        if (filterOverlay) {
            filterOverlay.addEventListener('click', () => {
                filterPanel.classList.remove('active');
                filterOverlay.classList.remove('active');
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filterPanel.classList.contains('active')) {
                filterPanel.classList.remove('active');
                if (filterOverlay) filterOverlay.classList.remove('active');
            }
        });
    }

    renderProjectCategoryFilters() {
        const categoryFiltersContainer = document.getElementById('project-category-filters');
        if (!categoryFiltersContainer) return;

        if (this.availableCategories.length === 0) {
            categoryFiltersContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No categories available</p>';
            return;
        }

        categoryFiltersContainer.innerHTML = this.availableCategories.map(category => `
            <label class="category-filter-label" style="${getSharedCategoryStyle(category)}">
                <input type="checkbox" class="project-category-filter category-filter" data-category="${escapeHtml(category)}">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">${escapeHtml(category)}</span>
            </label>
        `).join('');
    }

    setupProjectCategoryFilters() {
        document.querySelectorAll('.project-category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const category = event.target.dataset.category;
                if (event.target.checked) {
                    this.selectedCategories.add(category);
                } else {
                    this.selectedCategories.delete(category);
                }
                this.updateProjectTagFilters();
                this.renderFilteredProjects();
            });
        });
    }

    setupProjectTagFilters() {
        const clearTagsBtn = document.getElementById('clear-project-tags-btn');
        if (clearTagsBtn) {
            clearTagsBtn.addEventListener('click', () => {
                this.selectedTags.clear();
                document.querySelectorAll('#project-tag-filters .tag-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.renderFilteredProjects();
            });
        }
    }

    updateProjectTagFilters() {
        let tagsToShow = [];

        if (this.selectedCategories.size === 0) {
            tagsToShow = Array.from(this.allTags.keys());
        } else {
            this.allTags.forEach((categories, tag) => {
                for (const selectedCategory of this.selectedCategories) {
                    if (categories.has(selectedCategory)) {
                        tagsToShow.push(tag);
                        break;
                    }
                }
            });
        }

        const tagFiltersContainer = document.getElementById('project-tag-filters');
        if (!tagFiltersContainer) return;

        tagsToShow = Array.from(new Set(tagsToShow)).sort();
        const visibleTags = new Set(tagsToShow);
        this.selectedTags.forEach(tag => {
            if (!visibleTags.has(tag)) {
                this.selectedTags.delete(tag);
            }
        });

        if (tagsToShow.length === 0) {
            tagFiltersContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No technologies available</p>';
            return;
        }

        tagFiltersContainer.innerHTML = tagsToShow.map(tag => {
            const isActive = this.selectedTags.has(tag);
            return `<button class="tag-filter-btn ${isActive ? 'active' : ''}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
        }).join('');

        tagFiltersContainer.querySelectorAll('.tag-filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.dataset.tag;

                if (this.selectedTags.has(tag)) {
                    this.selectedTags.delete(tag);
                    button.classList.remove('active');
                } else {
                    this.selectedTags.add(tag);
                    button.classList.add('active');
                }

                this.renderFilteredProjects();
            });
        });
    }

    getFilteredProjects() {
        let filtered = [...this.projects];

        // Filter by category
        if (this.selectedCategories.size > 0) {
            filtered = filtered.filter(project =>
                this.selectedCategories.has(project.category || 'general')
            );
        }

        // Filter by tags (technologies)
        if (this.selectedTags.size > 0) {
            filtered = filtered.filter(project => {
                if (!project.technologies || !Array.isArray(project.technologies)) {
                    return false;
                }
                // Project must have at least one of the selected tags
                return project.technologies.some(tag => this.selectedTags.has(tag));
            });
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    }

    renderFilteredProjects() {
        const projectsContainer = document.getElementById('projects-grid');
        if (!projectsContainer) return;

        const filteredProjects = this.getFilteredProjects();
        const useFeaturedLayout = this.selectedCategories.size === 0 && this.selectedTags.size === 0;

        // Update projects count
        const countElement = document.getElementById('projects-count');
        if (countElement) {
            const totalCount = this.projects.length;
            const filteredCount = filteredProjects.length;

            if (this.selectedCategories.size > 0 || this.selectedTags.size > 0) {
                countElement.textContent = `Showing ${filteredCount} of ${totalCount} projects`;
            } else {
                countElement.textContent = `${totalCount} ${totalCount === 1 ? 'project' : 'projects'}`;
            }
        }

        // Clear and render projects
        projectsContainer.innerHTML = '';
        projectsContainer.classList.toggle('projects-grid--uniform', !useFeaturedLayout);
        projectsContainer.classList.toggle('projects-grid--single', !useFeaturedLayout && filteredProjects.length === 1);

        if (filteredProjects.length === 0) {
            projectsContainer.innerHTML = '<p style="color: var(--text-secondary);">No projects match the selected filters.</p>';
            return;
        }

        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project, { useFeaturedLayout });
            projectsContainer.appendChild(projectCard);
        });
    }

    createProjectCard(project, options = {}) {
        try {
            const { useFeaturedLayout = true } = options;
            const isFeaturedLayout = project.featured && useFeaturedLayout;
            const card = document.createElement('article');
            card.className = `project-card${isFeaturedLayout ? ' featured' : ''}`;

            const imageUrl = project.image ? this.configManager.replaceVariables(project.image) : null;
            const visualMark = project.title
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(word => word[0]?.toUpperCase() || '')
                .join('');
            const visualHTML = `
                <div class="project-card-visual${imageUrl ? '' : ' project-card-visual--fallback'}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${project.title}" class="project-image" loading="lazy" onerror="const wrapper=this.closest('.project-card-visual'); wrapper.classList.add('project-card-visual--fallback'); this.remove();">` : ''}
                    <span class="project-card-mark" aria-hidden="true">${visualMark || 'P'}</span>
                </div>
            `;

            const detailUrl = buildDetailPath('project-detail', project.id);

            // Create technologies tags
            const showTechTags = this.configManager?.isFeatureEnabled('project_tags');
            const techArray = Array.isArray(project.technologies) ? project.technologies : [];
            const techHTML = showTechTags && techArray.length > 0
                ? `<div class="project-tech">${techArray.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>`
                : '';
            const metaChip = project.featured
                ? '<span class="page-chip">Featured project</span>'
                : '<span class="page-chip subtle">Project</span>';
            const categoryBadge = renderSharedCategoryBadge(project.category);

            card.innerHTML = `
                ${visualHTML}
                <div class="project-content">
                    <div class="project-card-meta">
                        ${metaChip}
                        ${categoryBadge}
                        ${project.date ? `<span class="project-card-date">${this.formatDate(project.date)}</span>` : ''}
                    </div>
                    <h3 class="project-title">
                        <a href="${detailUrl}" class="project-title-link">${project.title}</a>
                    </h3>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-card-footer">
                        ${techHTML}
                        <a href="${detailUrl}" class="card-inline-action">View details</a>
                    </div>
                </div>
            `;

            return card;
        } catch (error) {
            console.error('Error creating project card:', error);
            // Return error card on failure
            const errorCard = document.createElement('article');
            errorCard.className = 'project-card';
            errorCard.innerHTML = '<p style="color: var(--text-secondary);">Error loading project</p>';
            return errorCard;
        }
    }

    async loadProjectDetail() {
        const projectId = getUrlDetailId('project-detail');

        if (!projectId) {
            window.location.href = 'projects.html';
            return;
        }

        // Load projects from markdown files first
        await this.loadProjectsFromFiles();

        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            window.location.href = 'projects.html';
            return;
        }

        this.updatePageMeta(project);

        try {
            let html = project.html || '';

            if (!html && project.content) {
                html = await this.markdownParser.parse(project.content);
            }

            if (!html) {
                const response = await fetch(`projects/${project.file}`);
                const rawContent = await response.text();
                const parsedProject = this.parseFrontmatter(rawContent, project.file);
                html = await this.markdownParser.parse(parsedProject.content);
            }

            this.renderProjectDetail(project, html);

        } catch (error) {
            console.error('Error loading project detail:', error);
            this.renderError();
        }
    }

    updatePageMeta(project) {
        const siteName = this.configManager?.getSiteName() || 'Portfolio';
        const pagePath = buildDetailPath('project-detail', project.id);
        const canonicalUrl = buildRuntimeUrl(this.configManager, pagePath);

        updateRuntimeSeo({
            configManager: this.configManager,
            title: `${project.title} | ${siteName}`,
            description: project.description,
            pagePath,
            image: project.image,
            schema: {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: project.title,
                description: truncateSeoText(project.description),
                image: getRuntimeImageUrl(this.configManager, project.image),
                url: canonicalUrl,
                datePublished: project.date,
                genre: project.category || 'general',
                creator: buildRuntimePersonSchema(this.configManager),
                keywords: Array.isArray(project.technologies) ? project.technologies.join(', ') : undefined,
                sameAs: getProjectLinks(project).map(link => link.url)
            }
        });
    }

    renderProjectDetail(project, html) {
        const container = document.getElementById('project-detail-container');
        if (!container) return;

        const linkItems = getProjectLinks(project).map(link => renderProjectLink(link, 'project-detail-link'));
        const linksHTML = linkItems.length > 0
            ? `<div class="project-detail-links-section">
                <h3>Links</h3>
                <div class="project-detail-links">${linkItems.join('')}</div>
            </div>`
            : '';

        const showTechTags = this.configManager?.isFeatureEnabled('project_tags');
        const techHTML = showTechTags && project.technologies.length > 0
            ? `<div class="project-detail-tech">
                <h3>Stack</h3>
                <div class="tech-tags">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>
            </div>`
            : '';

        container.innerHTML = `
            <article class="project-detail">
                <div class="detail-back-row">
                    <a href="projects.html" class="back-link">← Back to Projects</a>
                </div>
                <header class="project-detail-header">
                    <div class="project-detail-meta">
                        <span class="page-chip">Project</span>
                        ${renderSharedCategoryBadge(project.category)}
                        ${project.date ? `<span class="project-card-date">${this.formatDate(project.date)}</span>` : ''}
                    </div>
                    <div class="project-detail-hero">
                        <div class="project-detail-intro">
                            <h1 class="project-detail-title">${project.title}</h1>
                            <p class="project-detail-description">${project.description}</p>
                            ${linksHTML}
                            ${techHTML}
                        </div>
                        ${project.image ? `<div class="project-detail-media"><img src="${this.configManager.replaceVariables(project.image)}" alt="${project.title}" class="project-detail-image"></div>` : ''}
                    </div>
                </header>
                <div class="project-detail-content prose">
                    ${html}
                </div>
                <footer class="project-detail-footer">
                    <a href="projects.html" class="back-link">← Back to Projects</a>
                </footer>
            </article>
        `;

        enhanceRichContent(container);
    }


    renderError() {
        const container = document.getElementById('project-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl);">
                <h2>Project not found</h2>
                <p style="color: var(--text-secondary); margin-top: var(--spacing-md);">
                    The project you're looking for doesn't exist or couldn't be loaded.
                </p>
                <a href="projects.html" class="inline-link" style="margin-top: var(--spacing-md); display: inline-block;">
                    ← Back to projects
                </a>
            </div>
        `;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

// ===========================
// Experience System Module
// ===========================

class ExperienceSystem {
    constructor(configManager = null) {
        this.entries = [];
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/experience-files.json';
    }

    async fetchExperienceFiles() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch experience files');
            }
            const data = await response.json();
            return data.files || [];
        } catch (error) {
            console.error('Error fetching experience files:', error);
            return [];
        }
    }

    async loadExperienceFromFiles() {
        this.entries = await this.fetchExperienceFiles();
        return this.entries;
    }

    parseFrontmatter(content, filename) {
        if (!content.startsWith('---')) {
            return null;
        }

        const parts = content.split('---');
        if (parts.length < 3) {
            return null;
        }

        const frontmatterText = parts[1].trim();
        const markdownContent = parts.slice(2).join('---');
        const frontmatter = {};
        const lines = frontmatterText.split('\n');

        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;

            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim());
            } else if (value === 'true') value = true;
            else if (value === 'false') value = false;

            frontmatter[key] = value;
        }

        const id = filename.replace('.md', '').replace(/[\\/ ]+/g, '-').toLowerCase();

        return {
            id,
            company: frontmatter.company || 'Company',
            role: frontmatter.role || 'Role',
            description: frontmatter.description || '',
            employmentType: frontmatter.employmentType || 'Experience',
            location: frontmatter.location || '',
            startDate: frontmatter.startDate || '',
            endDate: frontmatter.endDate || '',
            current: frontmatter.current || false,
            website: frontmatter.website || '',
            technologies: frontmatter.technologies || [],
            published: frontmatter.published || false,
            featured: frontmatter.featured || false,
            file: `experience/${filename}`,
            content: markdownContent
        };
    }

    formatMonth(dateValue) {
        if (!dateValue) return '';
        const normalized = /^\d{4}-\d{2}$/.test(dateValue) ? `${dateValue}-01` : dateValue;
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) return dateValue;
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    formatDateRange(entry) {
        const start = this.formatMonth(entry.startDate);
        const end = entry.current ? 'Present' : this.formatMonth(entry.endDate);
        if (start && end) return `${start} - ${end}`;
        return start || end || '';
    }

    getEmploymentTypeClass(type) {
        const normalized = String(type || '').toLowerCase().replace(/\s+/g, '-');
        if (normalized.includes('full-time') || normalized.includes('fulltime')) return 'full-time';
        if (normalized.includes('intern')) return 'internship';
        return 'general';
    }

    getEmploymentBadge(type) {
        const safeType = escapeHtml(type || 'Experience');
        const className = this.getEmploymentTypeClass(type);
        return `<span class="experience-badge ${className}">${safeType}</span>`;
    }

    async loadExperienceList() {
        const container = document.getElementById('experience-list');
        if (!container) return;

        await this.loadExperienceFromFiles();

        const countElement = document.getElementById('experience-count');
        if (countElement) {
            countElement.textContent = `${this.entries.length} ${this.entries.length === 1 ? 'role' : 'roles'}`;
        }

        container.innerHTML = '';

        if (this.entries.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No experience entries published yet.</p>';
            return;
        }

        this.entries.forEach(entry => {
            const card = this.createExperienceCard(entry);
            container.appendChild(card);
        });
    }

    createExperienceCard(entry) {
        const card = document.createElement('article');
        const detailUrl = buildDetailPath('experience-detail', entry.id);
        const technologies = Array.isArray(entry.technologies) && entry.technologies.length > 0
            ? `<div class="experience-tags">${entry.technologies.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}</div>`
            : '';
        card.className = 'experience-card';
        card.innerHTML = `
            <div class="experience-card-meta">
                ${this.getEmploymentBadge(entry.employmentType)}
                ${this.formatDateRange(entry) ? `<span class="experience-date">${this.formatDateRange(entry)}</span>` : ''}
            </div>
            <h2 class="experience-company">
                <a href="${detailUrl}" class="experience-company-link">${escapeHtml(entry.company)}</a>
            </h2>
            <p class="experience-role">${escapeHtml(entry.role)}</p>
            <p class="experience-description">${escapeHtml(entry.description || '')}</p>
            ${technologies}
            <div class="experience-card-footer">
                ${entry.location ? `<span class="experience-location">${escapeHtml(entry.location)}</span>` : ''}
                <a href="${detailUrl}" class="card-inline-action">View details</a>
            </div>
        `;
        return card;
    }

    async loadExperienceDetail() {
        const entryId = getUrlDetailId('experience-detail');
        if (!entryId) {
            window.location.href = 'experience.html';
            return;
        }

        await this.loadExperienceFromFiles();
        const entry = this.entries.find(item => item.id === entryId);
        if (!entry) {
            window.location.href = 'experience.html';
            return;
        }

        this.updatePageMeta(entry);

        try {
            let html = entry.html || '';

            if (!html && entry.content) {
                html = await this.markdownParser.parse(entry.content);
            }

            if (!html) {
                const response = await fetch(`experience/${entry.file}`);
                const rawContent = await response.text();
                const parsedEntry = this.parseFrontmatter(rawContent, entry.file);
                html = await this.markdownParser.parse(parsedEntry.content);
            }

            this.renderExperienceDetail(entry, html);
        } catch (error) {
            console.error('Error loading experience detail:', error);
            this.renderError();
        }
    }

    updatePageMeta(entry) {
        const siteName = this.configManager?.getSiteName() || 'Portfolio';
        const title = `${entry.role || 'Experience'} at ${entry.company || siteName}`;
        const pagePath = buildDetailPath('experience-detail', entry.id);
        const canonicalUrl = buildRuntimeUrl(this.configManager, pagePath);

        updateRuntimeSeo({
            configManager: this.configManager,
            title: `${title} | ${siteName}`,
            description: entry.description,
            pagePath,
            schema: {
                '@context': 'https://schema.org',
                '@type': 'ProfilePage',
                name: title,
                description: truncateSeoText(entry.description),
                url: canonicalUrl,
                about: {
                    '@type': 'Organization',
                    name: entry.company,
                    url: entry.website
                },
                mainEntity: {
                    '@type': 'Person',
                    name: siteName,
                    jobTitle: entry.role,
                    worksFor: {
                        '@type': 'Organization',
                        name: entry.company,
                        url: entry.website
                    }
                }
            }
        });
    }

    renderExperienceDetail(entry, html) {
        const container = document.getElementById('experience-detail-container');
        if (!container) return;

        const links = [];
        if (entry.website) {
            links.push(`<a href="${entry.website}" class="project-detail-link" target="_blank" rel="noopener noreferrer">Company Website</a>`);
        }

        const technologies = Array.isArray(entry.technologies) && entry.technologies.length > 0
            ? `<div class="experience-tags">${entry.technologies.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}</div>`
            : '';

        container.innerHTML = `
            <article class="experience-detail content-loaded">
                <div class="detail-back-row">
                    <a href="experience.html" class="back-link">← Back to Experience</a>
                </div>
                <header class="experience-detail-header">
                    <div class="experience-detail-meta">
                        ${this.getEmploymentBadge(entry.employmentType)}
                        ${this.formatDateRange(entry) ? `<span class="experience-date">${this.formatDateRange(entry)}</span>` : ''}
                        ${entry.location ? `<span class="experience-location">${escapeHtml(entry.location)}</span>` : ''}
                    </div>
                    <h1 class="experience-detail-title">${escapeHtml(entry.company)}</h1>
                    <p class="experience-detail-role">${escapeHtml(entry.role)}</p>
                    ${entry.description ? `<p class="experience-detail-description">${escapeHtml(entry.description)}</p>` : ''}
                    ${links.length > 0 ? `<div class="project-detail-links">${links.join('')}</div>` : ''}
                    ${technologies}
                </header>
                <div class="experience-detail-content content-panel prose">
                    ${html}
                </div>
                <footer class="project-detail-footer">
                    <a href="experience.html" class="back-link">← Back to Experience</a>
                </footer>
            </article>
        `;

        enhanceRichContent(container);
    }

    renderError() {
        const container = document.getElementById('experience-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl);">
                <h2>Experience entry not found</h2>
                <p style="color: var(--text-secondary); margin-top: var(--spacing-md);">
                    The experience entry you're looking for doesn't exist or couldn't be loaded.
                </p>
                <a href="experience.html" class="inline-link" style="margin-top: var(--spacing-md); display: inline-block;">
                    ← Back to experience
                </a>
            </div>
        `;
    }
}

// ===========================
// Home System Module
// ===========================

class HomeSystem {
    constructor(configManager = null) {
        this.homeData = null;
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/home.json';
    }

    async fetchHomeContent() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch home content');
            }
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching home content:', error);
            return { content: '', exists: false };
        }
    }

    parseFrontmatter(content) {
        if (!content.startsWith('---')) {
            return { frontmatter: {}, markdownContent: content };
        }

        const parts = content.split('---');
        if (parts.length < 3) {
            return { frontmatter: {}, markdownContent: content };
        }

        const frontmatterText = parts[1].trim();
        const markdownContent = parts.slice(2).join('---');

        const frontmatter = {};
        const lines = frontmatterText.split('\n');

        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;

            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            if (value.startsWith('[') && value.endsWith(']')) {
                value = value
                    .slice(1, -1)
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean);
            }

            frontmatter[key] = value;
        }

        return { frontmatter, markdownContent };
    }

    async loadHomePage() {
        const container = document.getElementById('home-content-container');
        if (!container) return;

        try {
            const data = await this.fetchHomeContent();

            if (!data.exists || !data.content) {
                this.renderError(container);
                return;
            }

            const { frontmatter, markdownContent } = this.parseFrontmatter(data.content);
            this.homeData = { ...frontmatter, content: markdownContent, html: data.html || '' };

            await this.renderHomePage(container, this.homeData);

        } catch (error) {
            console.error('Error loading home page:', error);
            this.renderError(container);
        }
    }

    async renderHomePage(container, data) {
        const htmlContent = data.html || await this.markdownParser.parse(data.content);
        const showBio = this.configManager?.getSiteConfig('home_show_bio') !== false;
        const showSocial = this.configManager?.isFeatureEnabled('social_links') &&
            this.configManager?.getSiteConfig('home_show_social') !== false;
        const showQuickLinks = this.configManager?.getSiteConfig('home_show_quick_links') !== false;
        const kicker = this.configManager?.getSiteTagline() || 'Markdown-first portfolio';
        const displayName = data.name || this.configManager?.getSiteName() || 'Portfolio';
        const displayNameModifier = getNameDisplayModifier(displayName);
        const actions = [
            this.configManager?.isPageEnabled('projects') ? { href: 'projects.html', label: 'View projects', primary: true } : null,
            this.configManager?.isPageEnabled('blog') ? { href: 'blog.html', label: 'Read blog', primary: false } : null,
            this.configManager?.isPageEnabled('playlists') ? { href: 'playlists.html', label: 'Open playlists', primary: false } : null,
            this.configManager?.isPageEnabled('about') ? { href: 'about.html', label: 'About me', primary: false } : null
        ].filter(Boolean);

        const actionsHTML = showQuickLinks && actions.length > 0
            ? `<div class="home-actions">${actions.map(action => `
                <a href="${action.href}" class="home-action${action.primary ? ' primary' : ''}">${action.label}</a>
            `).join('')}</div>`
            : '';

        const socialLinksHTML = showSocial ? buildSocialLinks(data, 'home-social-links', 'home-social-btn') : '';
        const socialPanelHTML = socialLinksHTML
            ? `
                <section class="home-contact-panel">
                    <div class="panel-head">
                        <p class="panel-kicker">Connect</p>
                        <p class="panel-note">Profiles and direct contact</p>
                    </div>
                    ${socialLinksHTML}
                </section>
            `
            : '';
        const heroRailHTML = [actionsHTML, socialPanelHTML].filter(Boolean).join('');
        const mobileJumpHTML = this.renderMobileJumpLinks();

        container.innerHTML = `
            <div class="content-loaded">
            <section class="home-hero">
                <div class="home-hero-main">
                    <p class="section-kicker">${kicker}</p>
                    <h1 class="home-name ${displayNameModifier}">${displayName}</h1>
                    <p class="home-title">${data.title || this.configManager?.getSiteTagline() || 'Product-minded software engineer'}</p>
                    ${showBio && data.bio ? `<section class="home-bio"><p>${data.bio}</p></section>` : ''}
                </div>
                ${heroRailHTML ? `<div class="home-hero-rail">${heroRailHTML}</div>` : ''}
            </section>

            ${mobileJumpHTML}

            <section class="home-content content-panel prose">
                ${htmlContent}
            </section>
            </div>
        `;

        enhanceRichContent(container);
    }

    renderMobileJumpLinks() {
        if (!this.configManager || !this.configManager.siteConfigLoaded) {
            return '';
        }

        const navString = this.configManager.getSiteConfig('navigation');
        if (!navString) {
            return '';
        }

        const links = navString
            .split(',')
            .map(item => {
                const [page, label, url] = item.split('|').map(value => value.trim());
                return { page, label, url };
            })
            .filter(item => item.page && item.label && item.url)
            .filter(item => item.page !== 'home' && this.configManager.isPageEnabled(item.page));

        if (links.length === 0) {
            return '';
        }

        return `
            <nav class="home-mobile-jump" aria-label="Quick page links">
                <p class="section-kicker">Explore</p>
                <div class="home-mobile-jump-links">
                    ${links.map(link => `<a href="${escapeHtml(link.url)}" class="home-mobile-jump-link">${escapeHtml(link.label)}</a>`).join('')}
                </div>
            </nav>
        `;
    }

    renderError(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl);">
                <h2>Home content not found</h2>
                <p style="color: var(--text-secondary); margin-top: var(--spacing-md);">
                    Unable to load home page content. Please check that home/home.md exists.
                </p>
            </div>
        `;
    }
}

// ===========================
// About System Module
// ===========================

class AboutSystem {
    constructor(configManager = null) {
        this.aboutData = null;
        this.configManager = configManager;
        this.markdownParser = new MarkdownParser(configManager);
        this.apiEndpoint = '/api-static/about.json';
    }

    async fetchAboutContent() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch about content');
            }
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching about content:', error);
            return { content: '', exists: false };
        }
    }

    parseFrontmatter(content) {
        if (!content.startsWith('---')) {
            return { frontmatter: {}, markdownContent: content };
        }

        const parts = content.split('---');
        if (parts.length < 3) {
            return { frontmatter: {}, markdownContent: content };
        }

        const frontmatterText = parts[1].trim();
        const markdownContent = parts.slice(2).join('---');

        const frontmatter = {};
        const lines = frontmatterText.split('\n');

        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;

            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            frontmatter[key] = value;
        }

        return { frontmatter, markdownContent };
    }

    async loadAboutPage() {
        const container = document.getElementById('about-content-container');
        if (!container) return;

        try {
            const data = await this.fetchAboutContent();

            if (!data.exists || !data.content) {
                this.renderError(container);
                return;
            }

            const { frontmatter, markdownContent } = this.parseFrontmatter(data.content);
            this.aboutData = { ...frontmatter, content: markdownContent, html: data.html || '' };

            await this.renderAboutPage(container, this.aboutData);

        } catch (error) {
            console.error('Error loading about page:', error);
            this.renderError(container);
        }
    }

    async renderAboutPage(container, data) {
        const htmlContent = data.html || await this.markdownParser.parse(data.content);
        const showLocation = this.configManager?.getSiteConfig('about_show_location') !== false;
        const showSocial = this.configManager?.isFeatureEnabled('social_links') &&
            this.configManager?.getSiteConfig('about_show_social') !== false;
        const displayName = data.name || 'About Me';
        const displayNameModifier = getNameDisplayModifier(displayName);
        const socialLinksHTML = showSocial ? buildSocialLinks(data, 'about-social-links', 'about-social-link') : '';
        const socialPanelHTML = socialLinksHTML
            ? `
                <div class="about-contact-panel">
                    <div class="panel-head">
                        <p class="panel-kicker">Connect</p>
                        <p class="panel-note">Primary profiles and contact</p>
                    </div>
                    ${socialLinksHTML}
                </div>
            `
            : '';
        const focusHTML = Array.isArray(data.focus) && data.focus.length > 0
            ? `
                <div class="about-summary-block">
                    <p class="about-summary-label">Focus</p>
                    <div class="about-focus-list">
                        ${data.focus.map(item => `<span class="about-focus-chip">${item}</span>`).join('')}
                    </div>
                </div>
            `
            : '';
        const availabilityHTML = data.availability
            ? `
                <div class="about-summary-block about-summary-note">
                    <p class="about-summary-label">Availability</p>
                    <p class="about-summary-text">${data.availability}</p>
                </div>
            `
            : '';
        const summaryHTML = (focusHTML || availabilityHTML)
            ? `<div class="about-summary">${availabilityHTML}${focusHTML}</div>`
            : '';

        container.innerHTML = `
            <article class="about-content content-loaded">
                <header class="about-header">
                    <p class="section-kicker">About</p>
                    <h1 class="about-name ${displayNameModifier}">${displayName}</h1>
                    ${data.tagline ? `<p class="about-tagline">${data.tagline}</p>` : ''}
                    ${showLocation && data.location ? `<p class="about-location">${data.location}</p>` : ''}
                    ${socialPanelHTML}
                    ${summaryHTML}
                </header>
                <div class="about-body content-panel prose">
                    ${htmlContent}
                </div>
            </article>
        `;

        enhanceRichContent(container);
    }

    renderError(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl);">
                <h2>About content not found</h2>
                <p style="color: var(--text-secondary); margin-top: var(--spacing-md);">
                    Unable to load about page content. Please check that about/about.md exists.
                </p>
            </div>
        `;
    }
}

// ===========================
// Config Manager Module
// ===========================

class ConfigManager {
    constructor() {
        this.imageVariables = {};
        this.siteConfig = {};
        this.notesIndex = [];
        this.imageConfigLoaded = false;
        this.siteConfigLoaded = false;
        this.notesIndexLoaded = false;
        this.imageApiEndpoint = '/api-static/config/images.json';
        this.siteApiEndpoint = '/api-static/config/site.json';
        this.notesApiEndpoint = '/api-static/notes.json';
        this.bootstrap = window.__PORTFOLIO_BOOTSTRAP__ || null;
        this.buildVersion = this.bootstrap?.buildVersion || 'unversioned';
        this.storageKeys = {
            site: `portfolio-site-config:${this.buildVersion}`,
            images: `portfolio-image-config:${this.buildVersion}`,
            notes: `portfolio-notes-index:${this.buildVersion}`
        };
    }

    readSessionCache(key) {
        try {
            return sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    writeSessionCache(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (error) {
            // Ignore storage failures and continue with in-memory config.
        }
    }

    removeSessionCache(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            // Ignore storage failures and continue with in-memory config.
        }
    }

    async loadImageConfig() {
        if (this.imageConfigLoaded) {
            return this.imageVariables;
        }

        if (this.bootstrap?.imageVariables) {
            this.imageVariables = this.bootstrap.imageVariables;
            this.imageConfigLoaded = true;
            this.writeSessionCache(this.storageKeys.images, JSON.stringify(this.imageVariables));
            return this.imageVariables;
        }

        const cachedImages = this.readSessionCache(this.storageKeys.images);
        if (cachedImages) {
            try {
                this.imageVariables = JSON.parse(cachedImages);
                this.imageConfigLoaded = true;
                return this.imageVariables;
            } catch (error) {
                this.removeSessionCache(this.storageKeys.images);
            }
        }

        try {
            const response = await fetch(this.imageApiEndpoint, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to fetch image configuration');
            }
            const data = await response.json();

            if (data.exists && data.variables) {
                this.imageVariables = data.variables;
                this.imageConfigLoaded = true;
                this.writeSessionCache(this.storageKeys.images, JSON.stringify(this.imageVariables));
            }
        } catch (error) {
            console.error('Error loading image configuration:', error);
        }

        return this.imageVariables;
    }

    async loadSiteConfig() {
        if (this.siteConfigLoaded) {
            return this.siteConfig;
        }

        if (this.bootstrap?.siteConfig) {
            this.siteConfig = this.bootstrap.siteConfig;
            this.siteConfigLoaded = true;
            this.writeSessionCache(this.storageKeys.site, JSON.stringify(this.siteConfig));
            return this.siteConfig;
        }

        const cachedSiteConfig = this.readSessionCache(this.storageKeys.site);
        if (cachedSiteConfig) {
            try {
                this.siteConfig = JSON.parse(cachedSiteConfig);
                this.siteConfigLoaded = true;
                return this.siteConfig;
            } catch (error) {
                this.removeSessionCache(this.storageKeys.site);
            }
        }

        try {
            const response = await fetch(this.siteApiEndpoint, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to fetch site configuration');
            }
            const data = await response.json();

            if (data.exists && data.config) {
                this.siteConfig = data.config;
                this.siteConfigLoaded = true;
                this.writeSessionCache(this.storageKeys.site, JSON.stringify(this.siteConfig));
            }
        } catch (error) {
            console.error('Error loading site configuration:', error);
        }

        return this.siteConfig;
    }

    async loadAllConfigs() {
        await Promise.all([
            this.loadImageConfig(),
            this.loadSiteConfig(),
            this.loadNotesIndex()
        ]);
    }

    async loadNotesIndex() {
        if (this.notesIndexLoaded) {
            return this.notesIndex;
        }

        const hasUsableNotesIndex = notes => Array.isArray(notes)
            && notes.every(note => Array.isArray(note.aliases))
            && notes.some(note => typeof note.content === 'string');

        const cachedNotes = this.readSessionCache(this.storageKeys.notes);
        if (cachedNotes) {
            try {
                const parsed = JSON.parse(cachedNotes);
                if (hasUsableNotesIndex(parsed)) {
                    this.notesIndex = parsed;
                    this.notesIndexLoaded = true;
                    return this.notesIndex;
                }
                this.removeSessionCache(this.storageKeys.notes);
            } catch (error) {
                this.removeSessionCache(this.storageKeys.notes);
            }
        }

        try {
            const response = await fetch(this.notesApiEndpoint, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to fetch notes index');
            }
            const data = await response.json();
            if (Array.isArray(data.notes)) {
                this.notesIndex = data.notes;
                this.notesIndexLoaded = true;
                this.writeSessionCache(this.storageKeys.notes, JSON.stringify(this.notesIndex));
            }
        } catch (error) {
            console.error('Error loading notes index:', error);
        }

        return this.notesIndex;
    }

    replaceVariables(text) {
        if (!text) return text;

        let result = text;

        // Replace all {{VARIABLE_NAME}} patterns with actual values
        for (const [key, value] of Object.entries(this.imageVariables)) {
            const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            result = result.replace(pattern, value);
        }

        return result;
    }

    getVariable(name) {
        return this.imageVariables[name] || null;
    }

    getAllVariables() {
        return { ...this.imageVariables };
    }

    getSiteConfig(key) {
        return this.siteConfig[key];
    }

    getAllSiteConfig() {
        return { ...this.siteConfig };
    }

    getSiteName() {
        return this.getSiteConfig('site_name') || 'Portfolio';
    }

    getSiteTagline() {
        return this.getSiteConfig('site_tagline') || 'Selected work and writing';
    }

    getSiteDescription() {
        return this.getSiteConfig('site_description') || 'Markdown-driven portfolio site.';
    }

    getFooterText() {
        const raw = this.getSiteConfig('footer_text') || `© ${new Date().getFullYear()} ${this.getSiteName()}.`;
        return raw.replace(/\{\{\s*year\s*\}\}/gi, String(new Date().getFullYear()));
    }

    // Check if a page is enabled
    isPageEnabled(pageName) {
        const key = `enable_${pageName}`;
        return this.siteConfig[key] !== false; // Default to true if not set
    }

    // Check if a feature is enabled
    isFeatureEnabled(featureName) {
        const key = `feature_${featureName}`;
        return this.siteConfig[key] !== false; // Default to true if not set
    }
}

// ===========================
// Markdown Parser Module
// ===========================

class MarkdownParser {
    constructor(configManager = null) {
        this.configManager = configManager;
    }

    async parse(markdown, options = {}) {
        // Replace image variables before parsing if config manager is available
        if (this.configManager && this.configManager.imageConfigLoaded) {
            markdown = this.configManager.replaceVariables(markdown);
        }
        markdown = this.removeComments(markdown);
        markdown = this.injectBlockAnchors(markdown);

        if (markdown.includes('[[')) {
            markdown = await this.replaceObsidianLinks(markdown, options);
        }

        return this.parseFallback(markdown);
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

        return {
            target: rawTarget,
            size,
            noteName: noteName.trim(),
            heading,
            block
        };
    }

    parseObsidianImageSize(sizeValue) {
        if (!sizeValue) return {};
        const size = sizeValue.trim();
        if (!size) return {};

        const exact = size.match(/^(\d+)x(\d+)$/i);
        if (exact) {
            return { width: exact[1], height: exact[2] };
        }

        const widthOnly = size.match(/^(\d+)$/);
        if (widthOnly) {
            return { width: widthOnly[1] };
        }

        return {};
    }

    async getNotesIndex() {
        if (!this.configManager) return [];
        return this.configManager.loadNotesIndex();
    }

    async findNote(reference) {
        const notes = await this.getNotesIndex();
        const key = this.normalizeNoteKey(reference);
        if (!key) return null;

        return notes.find((note) => {
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
                return lines[i].replace(new RegExp(`\\s*\\^${blockId}\\s*$`), '');
            }
        }
        return markdown;
    }

    async renderEmbeddedNote(reference, options) {
        const resolved = this.parseObsidianReference(reference);
        const note = await this.findNote(resolved.noteName || resolved.target);
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

        const embeddedHtml = await this.parse(embeddedMarkdown, {
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

    async replaceObsidianLinks(markdown, options) {
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

        const embedMatches = Array.from(markdown.matchAll(/!\[\[([^\]]+)\]\]/g));
        for (const match of embedMatches) {
            const replacement = await this.renderObsidianEmbed(match[1], options);
            markdown = markdown.replace(match[0], () => `\n\n${replacement}\n\n`);
        }

        const linkMatches = Array.from(markdown.matchAll(/\[\[([^\]]+)\]\]/g));
        for (const match of linkMatches) {
            const replacement = await this.renderObsidianLink(match[1]);
            markdown = markdown.replace(match[0], () => replacement);
        }

        codePlaceholders.forEach((value, index) => {
            markdown = markdown.replace(`__MD_PLACEHOLDER_${index}__`, value);
        });

        return markdown;
    }

    async renderObsidianLink(reference) {
        const [targetPart, aliasPart] = reference.split('|');
        const resolved = this.parseObsidianReference(targetPart);
        const alias = (aliasPart || '').trim();

        if (!resolved.noteName && resolved.heading) {
            return `<a href="#${slugifyHeading(resolved.heading)}" class="wikilink">${escapeHtml(alias || resolved.heading)}</a>`;
        }

        const note = await this.findNote(resolved.noteName || resolved.target);
        if (!note) {
            return `<span class="wikilink missing">${escapeHtml(alias || resolved.target)}</span>`;
        }

        const label = alias || note.title || resolved.noteName || resolved.target;
        return `<a href="${this.buildNoteHref(note, resolved.heading, resolved.block)}" class="wikilink">${escapeHtml(label)}</a>`;
    }

    async renderObsidianEmbed(reference, options) {
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
            const mediaUrl = this.resolveMediaUrl(target);
            return `<iframe class="file-embed file-embed-pdf" src="${mediaUrl}" title="${escapeHtml(target)}"></iframe>`;
        }

        if (this.isAudioFile(target)) {
            const mediaUrl = this.resolveMediaUrl(target);
            return `<audio class="file-embed file-embed-audio" controls src="${mediaUrl}"></audio>`;
        }

        if (this.isVideoFile(target)) {
            const mediaUrl = this.resolveMediaUrl(target);
            return `<video class="file-embed file-embed-video" controls src="${mediaUrl}"></video>`;
        }

        return this.renderEmbeddedNote(reference, options);
    }

    getMarkdownItPlugin(...names) {
        for (const name of names) {
            const pluginExport = window[name];
            if (typeof pluginExport === 'function') {
                return pluginExport;
            }
            if (typeof pluginExport?.default === 'function') {
                return pluginExport.default;
            }
            if (typeof pluginExport?.full === 'function') {
                return pluginExport.full;
            }
        }

        return null;
    }

    transformWithProtectedCode(markdown, transformer) {
        const placeholders = [];
        let protectedMarkdown = markdown.replace(/```[\s\S]*?```|`[^`\n]+`/g, (match) => {
            const token = `__MD_SAFE_${placeholders.length}__`;
            placeholders.push(match);
            return token;
        });

        protectedMarkdown = transformer(protectedMarkdown);

        placeholders.forEach((value, index) => {
            protectedMarkdown = protectedMarkdown.replace(`__MD_SAFE_${index}__`, value);
        });

        return protectedMarkdown;
    }

    applyMathFallback(markdown) {
        return this.transformWithProtectedCode(markdown, value => value
            .replace(/\$\$([\s\S]+?)\$\$/g, (_, expression) => (
                `<div class="math math-block"><code>${escapeHtml(expression.trim())}</code></div>`
            ))
            .replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, prefix, expression) => (
                `${prefix}<span class="math math-inline"><code>${escapeHtml(expression.trim())}</code></span>`
            )));
    }

    applyFootnoteFallback(markdown) {
        const definitions = [];
        let nextIndex = 1;
        let transformed = markdown.replace(/^\[\^([^\]]+)\]:\s*(.+)$/gm, (_, id, body) => {
            definitions.push({
                id,
                index: nextIndex++,
                body
            });
            return '';
        });

        if (definitions.length === 0) {
            return markdown;
        }

        const indexById = new Map(definitions.map(definition => [definition.id, definition.index]));
        transformed = transformed.replace(/\[\^([^\]]+)\]/g, (match, id) => {
            const index = indexById.get(id);
            if (!index) return match;
            const safeId = slugifyHeading(id);
            return `<sup id="fnref-${safeId}" class="footnote-ref"><a href="#fn-${safeId}">${index}</a></sup>`;
        });

        const items = definitions.map((definition) => {
            const safeId = slugifyHeading(definition.id);
            return `<li id="fn-${safeId}">${escapeHtml(definition.body)} <a href="#fnref-${safeId}" class="footnote-backref" aria-label="Back to reference">&#8617;</a></li>`;
        }).join('');

        return `${transformed}\n\n<section class="footnotes"><ol>${items}</ol></section>`;
    }

    transformCallouts(html) {
        const container = document.createElement('div');
        container.innerHTML = html;

        container.querySelectorAll('blockquote').forEach((blockquote) => {
            const firstParagraph = blockquote.querySelector('p');
            if (!firstParagraph) return;

            const lines = firstParagraph.innerHTML.trim().split(/\n+/);
            const markerLine = (lines.shift() || '').trim();
            const match = markerLine.match(/^\[!([A-Za-z0-9_-]+)\]([+-])?\s*(.*)$/);
            if (!match) return;

            const type = match[1].toLowerCase();
            const foldState = match[2] || '';
            const title = match[3] || type.charAt(0).toUpperCase() + type.slice(1);
            const contentNodes = Array.from(blockquote.childNodes).slice(1);
            const inlineBodyHtml = lines.join('<br>').trim();

            if (foldState) {
                const details = document.createElement('details');
                details.className = `callout callout-${type}`;
                if (foldState === '+') {
                    details.open = true;
                }
                const summary = document.createElement('summary');
                summary.className = 'callout-title';
                summary.textContent = title;
                details.appendChild(summary);
                const body = document.createElement('div');
                body.className = 'callout-content';
                if (inlineBodyHtml) {
                    const inlineBody = document.createElement('p');
                    inlineBody.innerHTML = inlineBodyHtml;
                    body.appendChild(inlineBody);
                }
                contentNodes.forEach(node => body.appendChild(node.cloneNode(true)));
                details.appendChild(body);
                blockquote.replaceWith(details);
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = `callout callout-${type}`;
            const header = document.createElement('div');
            header.className = 'callout-title';
            header.textContent = title;
            const body = document.createElement('div');
            body.className = 'callout-content';
            if (inlineBodyHtml) {
                const inlineBody = document.createElement('p');
                inlineBody.innerHTML = inlineBodyHtml;
                body.appendChild(inlineBody);
            }
            contentNodes.forEach(node => body.appendChild(node.cloneNode(true)));
            wrapper.appendChild(header);
            wrapper.appendChild(body);
            blockquote.replaceWith(wrapper);
        });

        return container.innerHTML;
    }

    decorateTags(html) {
        const container = document.createElement('div');
        container.innerHTML = html;

        const skipParents = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE']);
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        const replacements = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.parentElement || skipParents.has(node.parentElement.tagName)) {
                continue;
            }

            const text = node.textContent;
            if (!text || !text.includes('#')) continue;
            if (!/(^|\s)#([A-Za-z0-9/_-]+)/.test(text)) continue;

            const fragment = document.createElement('span');
            fragment.innerHTML = escapeHtml(text).replace(/(^|\s)#([A-Za-z0-9/_-]+)/g, '$1<span class="obsidian-tag">#$2</span>');
            replacements.push({ node, fragment });
        }

        replacements.forEach(({ node, fragment }) => {
            node.replaceWith(...Array.from(fragment.childNodes));
        });

        return container.innerHTML;
    }

    parseFallback(markdown) {
        let html = markdown;

        html = this.applyMathFallback(html);
        html = this.applyFootnoteFallback(html);
        html = html.replace(/```([A-Za-z0-9_-]+)?\s*\n([\s\S]*?)```/gim, (_, rawLang, code) => {
            const lang = String(rawLang || '').trim().toLowerCase();
            if (lang === 'mermaid') {
                return `<div class="mermaid">${escapeHtml(code.trim())}</div>`;
            }

            if (lang === 'dataview' || lang === 'chart' || lang === 'kanban') {
                return `
                    <div class="plugin-block plugin-${lang}">
                        <div class="plugin-label">${lang}</div>
                        <pre><code class="hljs language-${lang}">${escapeHtml(code.trim())}</code></pre>
                    </div>
                `;
            }

            return `<pre><code class="${lang ? `language-${escapeHtml(lang)}` : ''}">${escapeHtml(code)}</code></pre>`;
        });
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
        html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" loading="lazy">');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^- \[ \] (.*$)/gim, '<li class="task-item"><span class="task-checkbox" aria-hidden="true"></span><span>$1</span></li>');
        html = html.replace(/^- \[x\] (.*$)/gim, '<li class="task-item completed"><span class="task-checkbox" aria-hidden="true"></span><span>$1</span></li>');
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><h/g, '<h');
        html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
        html = html.replace(/<p><ul>/g, '<ul>');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');
        html = html.replace(/<p><pre>/g, '<pre>');
        html = html.replace(/<\/pre><\/p>/g, '</pre>');
        html = html.replace(/<p><div/g, '<div');
        html = html.replace(/<\/div><\/p>/g, '</div>');
        html = html.replace(/<p><section/g, '<section');
        html = html.replace(/<\/section><\/p>/g, '</section>');
        html = html.replace(/<p><blockquote>/g, '<blockquote>');
        html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');
        html = html.replace(/<p><hr><\/p>/g, '<hr>');
        html = html.replace(/<p><\/p>/g, '');

        return html;
    }
}

// ===========================
// Navigation Manager Module
// ===========================

class NavigationManager {
    constructor(configManager = null) {
        this.configManager = configManager;
        this.navigationContainer = null;
    }

    /**
     * Initialize dynamic navigation across all pages
     */
    init() {
        this.navigationContainer = document.querySelector('.nav');
        if (!this.navigationContainer) {
            console.warn('Navigation container not found');
            return;
        }

        this.renderNavigation();
    }

    /**
     * Parse navigation configuration string
     * Format: "page|label|url, page|label|url, ..."
     */
    parseNavigationConfig(navString) {
        if (!navString) return [];

        return navString.split(',').map(item => {
            const [page, label, url] = item.split('|').map(s => s.trim());
            return { page, label, url };
        }).filter(item => item.page && item.label && item.url);
    }

    /**
     * Render navigation based on site configuration
     */
    renderNavigation() {
        if (!this.configManager || !this.configManager.siteConfigLoaded) {
            console.warn('Site configuration not loaded, using default navigation');
            return;
        }

        const navString = this.configManager.getSiteConfig('navigation');
        if (!navString) {
            console.warn('No navigation configuration found');
            return;
        }

        const navItems = this.parseNavigationConfig(navString);

        // Filter out disabled pages
        const enabledNavItems = navItems.filter(item => {
            return this.configManager.isPageEnabled(item.page);
        });

        if (enabledNavItems.length === 0) {
            console.warn('No enabled navigation items found');
            return;
        }

        const currentPage = this.getCurrentPageName();
        const existingLinks = Array.from(this.navigationContainer.querySelectorAll('.nav-link'));
        const matchesExistingShell = existingLinks.length === enabledNavItems.length &&
            existingLinks.every((link, index) => {
                const item = enabledNavItems[index];
                const href = link.getAttribute('href') || '';
                return href === item.url && link.textContent.trim() === item.label;
            });

        if (matchesExistingShell) {
            existingLinks.forEach((link, index) => {
                const item = enabledNavItems[index];
                link.classList.toggle('active', item.page === currentPage);
            });
            return;
        }

        // Build navigation HTML only when the shell is out of sync with config
        const navHTML = enabledNavItems.map(item => {
            const isActive = item.page === currentPage;
            return `<a href="${item.url}" class="nav-link ${isActive ? 'active' : ''}">${item.label}</a>`;
        }).join('');

        this.navigationContainer.innerHTML = navHTML;
    }

    /**
     * Check if a page should be accessible
     */
    isPageAccessible(pageName) {
        if (!this.configManager || !this.configManager.siteConfigLoaded) {
            return true; // Default to accessible if config not loaded
        }
        return this.configManager.isPageEnabled(pageName);
    }

    /**
     * Redirect if current page is disabled
     */
    checkPageAccess() {
        const currentPage = this.getCurrentPageName();

        // Check if current page is accessible
        if (currentPage && !this.isPageAccessible(currentPage)) {
            console.warn(`Page "${currentPage}" is disabled, redirecting to home`);
            window.location.href = 'index.html';
        }
    }

    static getRouteName(pathname = window.location.pathname) {
        const normalizedPath = decodeURIComponent(pathname || '/')
            .toLowerCase()
            .replace(/\\/g, '/')
            .replace(/\/{2,}/g, '/');

        const segments = normalizedPath
            .split('/')
            .filter(Boolean);

        const lastSegment = (segments[segments.length - 1] || '')
            .replace(/\.html$/i, '');

        if (!lastSegment || lastSegment === 'index') return 'home';

        const directRoutes = new Set([
            'about',
            'blog',
            'blog-post',
            'experience',
            'experience-detail',
            'playlists',
            'playlist-detail',
            'projects',
            'project-detail'
        ]);

        if (directRoutes.has(lastSegment)) {
            return lastSegment;
        }

        // Fallback for hosts that rewrite clean URLs under nested paths.
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'playlist-detail')) return 'playlist-detail';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'project-detail')) return 'project-detail';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'experience-detail')) return 'experience-detail';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'blog-post')) return 'blog-post';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'playlists')) return 'playlists';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'projects')) return 'projects';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'experience')) return 'experience';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'blog')) return 'blog';
        if (segments.some(segment => segment.replace(/\.html$/i, '') === 'about')) return 'about';

        return null;
    }

    static getPageNameFromRoute(routeName) {
        if (routeName === 'playlist-detail') return 'playlists';
        if (routeName === 'project-detail') return 'projects';
        if (routeName === 'experience-detail') return 'experience';
        if (routeName === 'blog-post') return 'blog';
        return routeName;
    }

    static getPageNameFromBody() {
        const pageClass = Array.from(document.body?.classList || [])
            .find(className => className.startsWith('page-'));

        if (!pageClass) {
            return null;
        }

        const pageName = pageClass.replace(/^page-/, '');
        const knownPages = new Set(['home', 'about', 'blog', 'experience', 'playlists', 'projects']);

        return knownPages.has(pageName) ? pageName : null;
    }

    getCurrentPageName() {
        return NavigationManager.getPageNameFromRoute(NavigationManager.getRouteName()) ||
            NavigationManager.getPageNameFromBody();
    }
}

// ===========================
// Application Initialization
// ===========================

class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.configManager = new ConfigManager();
        this.navigationManager = new NavigationManager(this.configManager);
        this.blogSystem = new BlogSystem(this.configManager);
        this.playlistSystem = new PlaylistSystem(this.configManager);
        this.projectSystem = new ProjectSystem(this.configManager);
        this.experienceSystem = new ExperienceSystem(this.configManager);
        this.aboutSystem = new AboutSystem(this.configManager);
        this.homeSystem = new HomeSystem(this.configManager);
    }

    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            // Load all configurations first (images + site config)
            await this.configManager.loadAllConfigs();

            // Initialize navigation manager
            this.navigationManager.init();

            // Apply global site content to the shell
            this.applyShellContent();

            // Check if current page is accessible
            this.navigationManager.checkPageAccess();

            // Then initialize the current page
            this.initializeCurrentPage();

            // Setup global UI enhancements
            this.setupScrollToTop();
            this.setupMobileMenu();
        });
    }

    /** Scroll-to-top button: appears after scrolling 400px */
    setupScrollToTop() {
        const btn = document.createElement('button');
        btn.className = 'scroll-top-btn';
        btn.setAttribute('aria-label', 'Scroll to top');
        btn.innerHTML = '↑';
        document.body.appendChild(btn);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    btn.classList.toggle('visible', window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /** Mobile hamburger menu */
    setupMobileMenu() {
        const header = document.querySelector('.header');
        const controls = document.querySelector('.header-controls');
        if (!header || !controls) return;

        // Create hamburger button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        menuBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="7" x2="20" y2="7"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="17" x2="20" y2="17"></line>
        </svg>`;
        header.insertBefore(menuBtn, controls);

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = controls.classList.toggle('menu-open');
            menuBtn.setAttribute('aria-expanded', isOpen);
            menuBtn.innerHTML = isOpen
                ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>`;
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (controls.classList.contains('menu-open') && !header.contains(e.target)) {
                controls.classList.remove('menu-open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>`;
            }
        });

        // Close menu on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && controls.classList.contains('menu-open')) {
                controls.classList.remove('menu-open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>`;
                menuBtn.focus();
            }
        });
    }

    applyShellContent() {
        const siteName = this.configManager.getSiteName();
        const siteTagline = this.configManager.getSiteTagline();
        const siteDescription = this.configManager.getSiteDescription();
        const footerText = this.configManager.getFooterText();
        const brandMark = siteName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('') || 'P';

        document.querySelectorAll('.brand-name').forEach(element => {
            element.textContent = siteName;
        });
        document.querySelectorAll('.brand-tagline').forEach(element => {
            element.textContent = siteTagline;
        });
        document.querySelectorAll('.brand-mark').forEach(element => {
            element.textContent = brandMark;
        });
        document.querySelectorAll('.footer-text').forEach(element => {
            element.textContent = footerText;
        });

        this.syncSourceCodeGithubLink();

        if (!this.configManager.isFeatureEnabled('theme_toggle')) {
            document.querySelectorAll('.theme-toggle').forEach(button => {
                button.style.display = 'none';
            });
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = siteDescription;
        }

        const pageTitle = this.getBasePageTitle();
        if (pageTitle === 'home') {
            document.title = `${siteName} | ${siteTagline}`;
        } else if (pageTitle) {
            document.title = `${pageTitle} | ${siteName}`;
        } else {
            document.title = siteName;
        }
    }

    getBasePageTitle() {
        const routeName = NavigationManager.getRouteName() || NavigationManager.getPageNameFromBody();
        if (['blog-post', 'project-detail', 'playlist-detail', 'experience-detail'].includes(routeName)) {
            return null;
        }

        const titles = {
            home: 'home',
            about: 'About',
            blog: 'Blog',
            experience: 'Experience',
            playlists: 'Playlists',
            projects: 'Projects'
        };

        return titles[routeName] || 'home';
    }

    syncSourceCodeGithubLink() {
        const settings = getSourceCodeGithubSettings(this.configManager);
        const controls = document.querySelector('.header-controls');
        let link = document.querySelector('.source-code-link');

        if (!settings.enabled) {
            if (link) link.remove();
            return;
        }

        if (!link && controls) {
            const themeToggle = controls.querySelector('.theme-toggle');
            link = document.createElement('a');
            link.className = 'source-code-link';
            controls.insertBefore(link, themeToggle || null);
        }

        if (!link) return;

        const label = String(settings.label || 'Source code');
        link.href = settings.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = label;
        link.setAttribute('aria-label', label);
        link.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="${getGithubIconPath()}"></path>
            </svg>
        `;
    }

    initializeCurrentPage() {
        const routeName = NavigationManager.getRouteName() || NavigationManager.getPageNameFromBody();

        if (routeName === 'blog') {
            if (this.configManager.isFeatureEnabled('blog_filters')) {
                const filterPanel = new FilterPanel();
                filterPanel.init();
            } else {
                const filterToggle = document.getElementById('filter-toggle-btn');
                if (filterToggle) filterToggle.style.display = 'none';
            }
            this.blogSystem.loadBlogList();
        } else if (routeName === 'blog-post') {
            this.blogSystem.loadBlogPost();
        } else if (routeName === 'playlists') {
            this.playlistSystem.loadPlaylistList();
        } else if (routeName === 'playlist-detail') {
            this.playlistSystem.loadPlaylistDetail();
        } else if (routeName === 'experience') {
            this.experienceSystem.loadExperienceList();
        } else if (routeName === 'experience-detail') {
            this.experienceSystem.loadExperienceDetail();
        } else if (routeName === 'projects') {
            this.projectSystem.loadProjectsList();
        } else if (routeName === 'project-detail') {
            this.projectSystem.loadProjectDetail();
        } else if (routeName === 'about') {
            this.aboutSystem.loadAboutPage();
        } else if (routeName === 'home') {
            this.homeSystem.loadHomePage();
        } else {
            this.homeSystem.loadHomePage();
        }
    }
}

// Initialize the application
const app = new App();
app.init();

