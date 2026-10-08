import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings


def create_access_token(user):

    payload = {
        "user_id": user.id,
        "username": user.username,
        "role": "customer",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return token

def verify_access_token(token):

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None