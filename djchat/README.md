# dChat Django Backend

## Running the ASGI Server

To run the ASGI server with production-like settings, use the new `runserver_asgi` management command:

```bash
python manage.py runserver_asgi
```

This will start Uvicorn with the following default settings:

- Port: 8003
- Workers: 5
- Log level: debug
- Auto-reload: enabled

### Customizing Settings

You can customize the settings using command line arguments:

```bash
# Change the port
python manage.py runserver_asgi --port 8000

# Change the number of workers
python manage.py runserver_asgi --workers 2

# Change the log level
python manage.py runserver_asgi --log-level info

# Disable auto-reload
python manage.py runserver_asgi --no-reload

# Combining options
python manage.py runserver_asgi --port 8005 --workers 3 --log-level warning --no-reload
```
