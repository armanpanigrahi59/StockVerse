#!/usr/bin/env python3
"""
Simple script to start the FastAPI server with proper configuration
"""
import uvicorn
import os

if __name__ == "__main__":
    # Change to the backend directory to ensure data.csv is found
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start the server
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
