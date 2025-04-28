import os
import sys
from django.core.management.base import BaseCommand
import subprocess


class Command(BaseCommand):
    help = "Run the ASGI server with production-like settings"

    def add_arguments(self, parser):
        parser.add_argument("--port", default="8003", help="Port to run the server on")
        parser.add_argument(
            "--host", default="0.0.0.0", help="Host to bind the server to"
        )
        parser.add_argument("--workers", default="5", help="Number of worker processes")
        parser.add_argument("--log-level", default="debug", help="Logging level")
        parser.add_argument(
            "--no-reload", action="store_true", help="Disable auto-reload"
        )

    def handle(self, *args, **options):
        port = options["port"]
        host = options["host"]
        workers = options["workers"]
        log_level = options["log_level"]
        reload_flag = not options["no_reload"]

        reload_option = "--reload" if reload_flag else ""

        self.stdout.write(
            self.style.SUCCESS(
                f"Starting ASGI server on {host}:{port} with {workers} workers..."
            )
        )

        cmd = f"uvicorn djchat.asgi:application --host {host} --port {port} --workers {workers} --log-level {log_level} {reload_option}"

        self.stdout.write(self.style.NOTICE(f"Running command: {cmd}"))

        try:
            subprocess.run(cmd, shell=True, check=True)
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS("Server stopped"))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Server failed to start: {e}"))
            sys.exit(1)
