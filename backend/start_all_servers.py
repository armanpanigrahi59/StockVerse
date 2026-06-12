#!/usr/bin/env python3
import subprocess
import sys
import time
import threading
import os

def run_fastapi_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

def run_flask_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "chatbot_server.py"])

def main():
    print("Starting servers...")
    print("FastAPI Data Server: http://localhost:8000")
    print("Flask Server: http://localhost:5000")
    
    fastapi_thread = threading.Thread(target=run_fastapi_server, daemon=True)
    fastapi_thread.start()
    
    time.sleep(2)
    
    try:
        run_flask_server()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()
