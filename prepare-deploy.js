const fs = require('fs');
const path = require('path');

const root = __dirname;
const outputDir = path.join(root, 'dist');

const files = [
    'index.html',
    'about.html',
    'blog.html',
    'blog-post.html',
    'projects.html',
    'project-detail.html',
    'experience.html',
    'experience-detail.html',
    'playlists.html',
    'playlist-detail.html',
    '_headers',
    '_redirects',
    'styles.css',
    'blog.js',
    'robots.txt',
    'sitemap.xml'
];

const directories = [
    'api-static',
    'assets'
];

function copyFile(relativePath) {
    const source = path.join(root, relativePath);
    const target = path.join(outputDir, relativePath);

    if (!fs.existsSync(source)) {
        return;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
}

function copyDirectory(relativePath) {
    const source = path.join(root, relativePath);
    const target = path.join(outputDir, relativePath);

    if (!fs.existsSync(source)) {
        return;
    }

    fs.cpSync(source, target, { recursive: true });
}

function readOutputJson(relativePath) {
    const source = path.join(outputDir, relativePath);

    if (!fs.existsSync(source)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(source, 'utf-8'));
}

function addBaseHref(html) {
    const withoutExistingBase = html.replace(/^\s*<base\s+href="[^"]*">\r?\n?/gmi, '');
    return withoutExistingBase.replace(/(<head>\r?\n?)/i, '$1    <base href="/">\n');
}

function copyRouteAlias(routePath, shellFile) {
    const segments = String(routePath || '')
        .split(/[\\/]+/)
        .filter(Boolean);

    if (segments.length === 0 || segments.some(segment => segment === '..' || path.isAbsolute(segment))) {
        throw new Error(`Invalid route alias: ${routePath}`);
    }

    const source = path.join(outputDir, shellFile);
    const target = path.join(outputDir, ...segments, 'index.html');

    if (!fs.existsSync(source)) {
        return;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, addBaseHref(fs.readFileSync(source, 'utf-8')));
}

function createRouteAliases() {
    [
        ['about', 'about.html'],
        ['blog', 'blog.html'],
        ['blog-post', 'blog-post.html'],
        ['projects', 'projects.html'],
        ['project-detail', 'project-detail.html'],
        ['experience', 'experience.html'],
        ['experience-detail', 'experience-detail.html'],
        ['playlists', 'playlists.html'],
        ['playlist-detail', 'playlist-detail.html']
    ].forEach(([routePath, shellFile]) => copyRouteAlias(routePath, shellFile));

    const blogData = readOutputJson('api-static/blog-files.json');
    const blogPosts = Array.isArray(blogData?.files) ? blogData.files : [];

    blogPosts
        .filter(post => post?.id)
        .forEach(post => copyRouteAlias(`blog-post/${post.id}`, 'blog-post.html'));

    const projectData = readOutputJson('api-static/project-files.json');
    const projects = Array.isArray(projectData?.files) ? projectData.files : [];

    projects
        .filter(project => project?.id)
        .forEach(project => copyRouteAlias(`project-detail/${project.id}`, 'project-detail.html'));

    const playlistData = readOutputJson('api-static/playlist-files.json');
    const playlists = Array.isArray(playlistData?.files) ? playlistData.files : [];

    playlists
        .filter(playlist => playlist?.id)
        .forEach(playlist => copyRouteAlias(`playlist-detail/${playlist.id}`, 'playlist-detail.html'));

    const experienceData = readOutputJson('api-static/experience-files.json');
    const experience = Array.isArray(experienceData?.files) ? experienceData.files : [];

    experience
        .filter(entry => entry?.id)
        .forEach(entry => copyRouteAlias(`experience-detail/${entry.id}`, 'experience-detail.html'));

    console.log(`Created ${blogPosts.length} static blog post route aliases`);
    console.log(`Created ${projects.length} static project route aliases`);
    console.log(`Created ${playlists.length} static playlist route aliases`);
    console.log(`Created ${experience.length} static experience route aliases`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

files.forEach(copyFile);
directories.forEach(copyDirectory);
createRouteAliases();

console.log(`Prepared Cloudflare Pages output in ${path.relative(root, outputDir)}/`);
