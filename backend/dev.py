#!/usr/bin/env python3
import subprocess
import sys
import threading
import time
import os

def run_frontend():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    subprocess.run(["npm", "run", "dev"])

def run_fastapi():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

def run_flask():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "chatbot_server.py"])

def main():
    print("\n=== Starting Development Servers ===\n")
    
    # Start frontend in a thread
    frontend_thread = threading.Thread(target=run_frontend, daemon=True)
    frontend_thread.start()
    print("Frontend starting at: http://localhost:8080")
    
    # Start FastAPI in a thread
    fastapi_thread = threading.Thread(target=run_fastapi, daemon=True)
    fastapi_thread.start()
    print("FastAPI starting at: http://localhost:8000")
    
    # Give some time for other servers to start
    time.sleep(2)
    
    print("Flask starting at: http://localhost:5000")
    print("\nPress Ctrl+C to stop all servers\n")
    
    # Run Flask in main thread
    try:
        run_flask()
    except KeyboardInterrupt:
        print("\nShutting down all servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()