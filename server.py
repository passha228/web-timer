import http.server
import socketserver
import json
import os
import time

PORT = 8000
TIMER_FILE = 'timer.json'

# Загрузка текущего времени из файла
def load_timer():
    if os.path.exists(TIMER_FILE):
        with open(TIMER_FILE, 'r') as file:
            data = json.load(file)
            return data['time']
    return 0

# Сохранение времени в файл
def save_timer(time):
    with open(TIMER_FILE, 'w') as file:
        json.dump({'time': time}, file)

class TimerHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/timer':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            current_time = load_timer()
            response = json.dumps({'time': current_time})
            self.wfile.write(response.encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/timer':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            save_timer(data['time'])
            self.send_response(200)
            self.end_headers()

Handler = TimerHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
