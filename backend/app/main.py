from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.database.session import engine, Base
from app.routes import auth
import app.models

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    for error in exc.errors():
        msg = str(error.get("msg", ""))
        loc = error.get("loc", [])
        if "email" in loc or "NWU" in msg or "valid NWU student email" in msg:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Please enter a valid NWU student email (e.g., 20242087010@nwu.ac.bd)."}
            )
    first_msg = exc.errors()[0]["msg"] if exc.errors() else "Invalid request payload"
    if first_msg.startswith("Value error, "):
        first_msg = first_msg.replace("Value error, ", "")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": first_msg}
    )

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Welcome to NoteBridge FastAPI Backend"}
