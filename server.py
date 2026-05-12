#!/usr/bin/env python3
"""Development HTTP server with caching headers, gzip compression, and threading."""

from __future__ import annotations

import gzip
import http.server
import io
import mimetypes
import os
import socketserver
import sys
from urllib.parse import urlparse

PORT = 8000

# Static assets that rarely change get a long cache. Generated JSON and HTML
# should revalidate so local builds are picked up immediately.
_CACHE_RULES = {
    ".css": ("public", 31_536_000),
    ".js": ("public", 31_536_000),
    ".woff2": ("public", 31_536_000),
    ".woff": ("public", 31_536_000),
    ".ttf": ("public", 31_536_000),
    ".png": ("public", 2_592_000),
    ".jpg": ("public", 2_592_000),
    ".jpeg": ("public", 2_592_000),
    ".webp": ("public", 2_592_000),
    ".svg": ("public", 2_592_000),
    ".ico": ("public", 2_592_000),
    ".json": ("no-cache", 0),
    ".html": ("no-cache", 0),
    ".md": ("no-cache", 0),
}

_COMPRESSIBLE = {
    "text/html",
    "text/css",
    "application/javascript",
    "text/javascript",
    "application/json",
    "text/plain",
    "image/svg+xml",
    "application/x-javascript",
    "text/xml",
    "application/xml",
}

_GZIP_MIN_BYTES = 1024
_LEGACY_API_REDIRECTS = {
    "/api/blog-files": "/api-static/blog-files.json",
    "/api/playlist-files": "/api-static/playlist-files.json",
    "/api/project-files": "/api-static/project-files.json",
    "/api/experience-files": "/api-static/experience-files.json",
    "/api/home": "/api-static/home.json",
    "/api/about": "/api-static/about.json",
    "/api/config/images": "/api-static/config/images.json",
    "/api/config/site": "/api-static/config/site.json",
}

_ROUTE_SHELLS = {
    "about": "about.html",
    "blog": "blog.html",
    "blog-post": "blog-post.html",
    "experience": "experience.html",
    "experience-detail": "experience-detail.html",
    "playlist-detail": "playlist-detail.html",
    "playlists": "playlists.html",
    "project-detail": "project-detail.html",
    "projects": "projects.html",
}


class BlogServerHandler(http.server.SimpleHTTPRequestHandler):
    """Static file server with cache headers, gzip support, and legacy redirects."""

    def log_request(self, code="-", size="-"):
        if isinstance(code, int) and code >= 400:
            super().log_request(code, size)

    def do_GET(self):
        path = urlparse(self.path).path

        if path in _LEGACY_API_REDIRECTS:
            self.send_response(301)
            self.send_header("Location", _LEGACY_API_REDIRECTS[path])
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return

        self._serve_static()

    def _serve_static(self):
        request_path = urlparse(self.path).path
        fs_path = self.translate_path(request_path)

        if os.path.isdir(fs_path):
            index_path = os.path.join(fs_path, "index.html")
            if os.path.isfile(index_path):
                fs_path = index_path

        if not os.path.isfile(fs_path):
            route_shell = self._resolve_route_shell(request_path)
            if route_shell:
                fs_path = self.translate_path(route_shell)
            if not os.path.isfile(fs_path):
                self.send_error(404, "File not found")
                return

        stat = os.stat(fs_path)
        mtime = int(stat.st_mtime)
        size = stat.st_size
        etag = f'"{mtime:x}-{size:x}"'

        if self.headers.get("If-None-Match") == etag:
            self.send_response(304)
            self.end_headers()
            return

        ext = os.path.splitext(fs_path)[1].lower()
        mime_type, _ = mimetypes.guess_type(fs_path)
        mime_type = mime_type or "application/octet-stream"

        policy, max_age = _CACHE_RULES.get(ext, ("no-cache", 0))
        if policy == "no-cache":
            cache_control = "no-cache, must-revalidate"
        else:
            cache_control = f"public, max-age={max_age}, immutable"

        with open(fs_path, "rb") as file_handle:
            body = file_handle.read()

        accept_encoding = self.headers.get("Accept-Encoding", "")
        use_gzip = (
            "gzip" in accept_encoding
            and mime_type in _COMPRESSIBLE
            and len(body) >= _GZIP_MIN_BYTES
        )

        if use_gzip:
            buffer = io.BytesIO()
            with gzip.GzipFile(fileobj=buffer, mode="wb", compresslevel=6) as gz_file:
                gz_file.write(body)
            body = buffer.getvalue()

        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache_control)
        self.send_header("ETag", etag)
        self.send_header("Last-Modified", self.date_time_string(mtime))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Vary", "Accept-Encoding")

        if use_gzip:
            self.send_header("Content-Encoding", "gzip")

        self.end_headers()
        self.wfile.write(body)

    @staticmethod
    def _resolve_route_shell(request_path):
        segments = [segment for segment in request_path.strip("/").split("/") if segment]
        if not segments:
            return None

        route_name = segments[0].removesuffix(".html")
        return _ROUTE_SHELLS.get(route_name)


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """Handle each request in its own thread."""

    allow_reuse_address = True
    daemon_threads = True


def run_server():
    try:
        with ThreadedTCPServer(("", PORT), BlogServerHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}/")
            print("Caching: CSS/JS=1yr  Images=30d  HTML/JSON=no-cache")
            print("Compression: gzip enabled for text assets")
            print("Concurrency: threaded")
            print("\nPress Ctrl+C to stop the server\n")

            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped gracefully")
    except OSError as error:
        if "Address already in use" in str(error) or "10048" in str(error):
            print(f"\nError: Port {PORT} is already in use.")
            print(f"To inspect: netstat -ano | findstr :{PORT}")
            print("Then: taskkill /F /PID [PID_NUMBER]\n")
        else:
            print(f"Error starting server: {error}")
        sys.exit(1)


if __name__ == "__main__":
    run_server()
