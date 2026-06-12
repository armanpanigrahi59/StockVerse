from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import asyncio
import httpx

app = FastAPI()

# Enable CORS so your React frontend can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://stock-verse-nine.vercel.app",
        "https://stock-verse-git-main-lavansh1306s-projects.vercel.app",
        "https://stock-verse-6czw53am8-lavansh1306s-projects.vercel.app",
        "https://stock-verse-s177qxsp7-lavansh1306s-projects.vercel.app",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:3000",
        "http://localhost:5173",
        "*"  # Temporarily allow all origins while testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Load CSV once at startup
df = pd.read_csv("data.csv")  # Ensure it has OHLC columns
df = df[['date', 'open', 'high', 'low', 'close', 'volume']]  # Keep OHLC columns
df_iterator = df.iterrows()  # Create an iterator for row-by-row access

# Shared state for the last fetched row
current_row = None

@app.get("/next_data")
async def next_data():
    """
    Returns the next row of the CSV as a JSON object.
    If the end of the CSV is reached, it will loop back to the start.
    """
    global df_iterator, current_row

    try:
        index, row = next(df_iterator)
        current_row = {
            "time": row["date"], 
            "value": float(row["open"])  # Use 'open' as the main value
        }
        print(f"Next data: {current_row}")  # Debug log
    except StopIteration:
        # Reset iterator when we reach the end
        df_iterator = df.iterrows()
        index, row = next(df_iterator)
        current_row = {
            "time": row["date"], 
            "value": float(row["open"])  # Use 'open' as the main value
        }
        print(f"Next data (reset): {current_row}")  # Debug log
    
    return current_row

@app.get("/current_data")
async def get_current_data():
    """
    Returns the last fetched row.
    Useful if frontend reconnects and wants the latest data.
    """
    return current_row or {
        "time": None, 
        "value": None
    }

@app.get("/test")
async def test():
    """
    Simple test endpoint to verify server is working.
    """
    return {"status": "Server is running!", "data_points": len(df)}

@app.get("/api/stock-data")
async def get_stock_data(limit: int = 50):
    """
    Get stock data from CSV with optional limit
    """
    try:
        # Return the last 'limit' rows from the dataframe
        data = df.tail(limit).to_dict(orient='records')
        return {
            "status": "success",
            "count": len(data),
            "data": data
        }
    except Exception as e:
        print(f"Error fetching stock data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/proxy/yahoo/{symbol}")
async def proxy_yahoo_finance(symbol: str, request: Request):
    """
    Proxy endpoint for Yahoo Finance data
    """
    try:
        # Get query parameters from the request
        query_params = dict(request.query_params)
        
        # Default parameters for Yahoo Finance API
        params = {
            "interval": query_params.get("interval", "1m"),
            "range": query_params.get("range", "1d")
        }
        
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
        
        print(f"Fetching from Yahoo Finance: {url} with params: {params}")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "application/json"
            }
            
            response = await client.get(url, headers=headers, params=params)
            
            if response.status_code != 200:
                print(f"Yahoo Finance API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from Yahoo Finance")
                
            data = response.json()
            
            # Return with proper CORS headers
            return JSONResponse(
                content=data,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                }
            )
            
    except httpx.TimeoutException:
        print(f"Timeout fetching data for {symbol}")
        raise HTTPException(status_code=504, detail="Request to Yahoo Finance timed out")
    except httpx.RequestError as e:
        print(f"Request error for {symbol}: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch data: {str(e)}")
    except Exception as e:
        print(f"Error in proxy for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Add OPTIONS endpoint for CORS preflight
@app.options("/proxy/yahoo/{symbol}")
async def proxy_yahoo_finance_options(symbol: str):
    """
    Handle CORS preflight requests
    """
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600"
        }
    )
