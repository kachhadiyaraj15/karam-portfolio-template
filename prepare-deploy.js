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
    '_redirects',
    'styles.css',
    'blog.js'
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

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

files.forEach(copyFile);
directories.forEach(copyDirectory);

console.log(`Prepared Cloudflare Pages output in ${path.relative(root, outputDir)}/`);
