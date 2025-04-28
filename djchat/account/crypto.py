from cryptography.fernet import Fernet
from django.conf import settings
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os


def get_fernet_key():
    """Generate a Fernet key from the SECRET_KEY."""
    # Use Django's SECRET_KEY to derive a Fernet key
    salt = b"django_jwt_salt"  # A constant salt
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(settings.SECRET_KEY.encode()))
    return key


def encrypt_token(token):
    """Encrypt a JWT token."""
    if not token:
        return None

    key = get_fernet_key()
    f = Fernet(key)
    token_bytes = token.encode("utf-8")
    encrypted_token = f.encrypt(token_bytes)
    return encrypted_token.decode("utf-8")


def decrypt_token(encrypted_token):
    """Decrypt an encrypted JWT token."""
    if not encrypted_token:
        return None

    key = get_fernet_key()
    f = Fernet(key)
    try:
        token_bytes = encrypted_token.encode("utf-8")
        decrypted_token = f.decrypt(token_bytes)
        return decrypted_token.decode("utf-8")
    except Exception as e:
        # Log the error
        print(f"Error decrypting token: {e}")
        return None
