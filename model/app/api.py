from fastapi import FastAPI, Request
import os
from dotenv import load_dotenv
from app.script import load_config, return_analysis
from app.base import AnalysisModel

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
client, prompt = load_config()

app = FastAPI()

origins = [
    os.environ["CORS_ALLOWED_ORIGINS"]
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"]
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": "Too many Requests. Please slow down."},
    )


@app.post("/ml/service/analysis")
@limiter.limit("5/minute")
def analysis(item: AnalysisModel, request: Request):
    try:
        text = item.text
        return return_analysis(text, prompt, client)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal Server Error: {str(e)}"}
        )
