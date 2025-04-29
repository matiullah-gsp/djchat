import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from account.crypto import decrypt_token
from channels.db import database_sync_to_async
from jwt.exceptions import ExpiredSignatureError


@database_sync_to_async
def get_user(scope):
    try:
        token = scope["token"]
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded_data.get("user_id")
        model = get_user_model()
        return model.objects.get(id=user_id)
    except ExpiredSignatureError:
        return AnonymousUser()
    except model.DoesNotExist:
        return AnonymousUser()
    except Exception as e:
        return AnonymousUser()


class JWTAuthenticationMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        headers_dict = dict(scope["headers"])
        cookie_str = headers_dict.get(b"cookie", b"").decode("utf-8")
        if cookie_str:
            cookies = {
                cookie.split("=")[0].strip(): cookie.split("=")[1].strip()
                for cookie in cookie_str.split(";")
            }
        else:
            cookies = {}
        access_token = cookies.get("access")
        if access_token:
            scope["token"] = decrypt_token(access_token)
            scope["user"] = await get_user(scope)
        else:
            scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)
