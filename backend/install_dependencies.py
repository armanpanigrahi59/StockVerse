#!/usr/bin/env python3
import subprocess
import sys

def install_requirements():
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies: {e}")
        return False

def main():
    print("StockBot Setup")
    print("-" * 30)
    
    if install_requirements():
        print("\nSetup complete!")
        print("\nTo start the servers:")
        print("1. Run: python start_all_servers.py")
        print("2. Or run separately:")
        print("   - FastAPI: python start_server.py")
        print("   - Flask: python assistant_server.py")
        print("\nAccess points:")
        print("- Data API: http://localhost:8000")
        print("- Chatbot: http://localhost:5000")
    else:
        print("\nSetup failed. Please check the error messages above.")

if __name__ == "__main__":
    main()
