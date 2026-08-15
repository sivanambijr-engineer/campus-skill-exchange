def verify_csrf(request: Request):
    origin = request.headers.get("origin")

    if not origin:
        return

    origin = origin.rstrip("/")

    allowed_origins = {
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://campus-skill-exchange-henna.vercel.app",
    }

    # Allow exact known origins
    if origin in allowed_origins:
        return

    # Allow Vercel preview deployments for this project
    preview_prefix = "https://campus-skill-exchange-"
    preview_suffix = "-niviq.vercel.app"

    if (
        origin.startswith(preview_prefix)
        and origin.endswith(preview_suffix)
    ):
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="CSRF origin check failed",
    )