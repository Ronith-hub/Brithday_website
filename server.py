#!/usr/bin/env python3
"""
Simple HTTP Server for 3D Birthday Presentation Website.
Run with: python3 server.py
"""
import http.server
import socketserver
import os
import sys
import json
import webbrowser

PORT = 8000
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DATA_FILE = os.path.join(DATA_DIR, 'submissions.json')

class BirthdayRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow cross-origin if needed & disable caching during development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/submissions':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'[]')
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/submissions':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            os.makedirs(DATA_DIR, exist_ok=True)

            try:
                submission = json.loads(post_data.decode('utf-8'))
                submissions = []
                if os.path.exists(DATA_FILE):
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        submissions = json.load(f)
                
                submission['id'] = len(submissions) + 1
                submissions.append(submission)

                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(submissions, f, indent=2)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok', 'submission': submission}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return
        return super().do_POST()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(DATA_DIR, exist_ok=True)
    
    port = PORT
    handler = BirthdayRequestHandler
    
    # Try port, if busy try next
    server = None
    for p in range(PORT, PORT + 20):
        try:
            server = socketserver.TCPServer(("", p), handler)
            port = p
            break
        except OSError:
            continue

    if not server:
        print("Could not bind to any port between 8000 and 8020.")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print("=" * 60)
    print(f"🎉 3D Birthday Presentation Server Running!")
    print(f"👉 Open in browser: {url}")
    print(f"🐾 Secret Admin Passcode: 4505 (Triple-click footer paw)")
    print("=" * 60)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()

if __name__ == '__main__':
    run_server()
