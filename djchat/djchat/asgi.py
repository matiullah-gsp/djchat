import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# from channels.auth import AuthMiddlewareStack


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djchat.settings")
django_application = get_asgi_application()



from webchat import urls

application = ProtocolTypeRouter(
    {
        "http": django_application,
        "websocket": URLRouter(urls.websocket_urlpatterns),
    }
)
