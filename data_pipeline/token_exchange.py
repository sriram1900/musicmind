import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# Check required values exist
if not CLIENT_ID or not CLIENT_SECRET or not REDIRECT_URI:
    raise SystemExit(" Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or REDIRECT_URI in .env")

#  Ask user to paste the code from URL (?code=...)
authorization_code = input("\nPaste the ?code= value from the Spotify redirect URL: ").strip()

#  Spotify Token Endpoint
token_url = "https://accounts.spotify.com/api/token"

#  Data to send to Spotify
data = {
    "grant_type": "authorization_code",
    "code": authorization_code,
    "redirect_uri": REDIRECT_URI,
}

#  Make POST request to exchange code for tokens
response = requests.post(token_url, data=data, auth=(CLIENT_ID, CLIENT_SECRET))

#  Error handling
if response.status_code != 200:
    print("\n Token exchange failed.")
    print("Status:", response.status_code)
    print("Response:", response.text)
    exit()

#  Parse response JSON
tokens = response.json()

print("\n TOKEN RESPONSE FROM SPOTIFY:\n")
print(json.dumps(tokens, indent=2))

# Save tokens to tokens.json
with open("tokens.json", "w") as f:
    json.dump(tokens, f, indent=2)

print("\n Tokens saved to tokens.json (do NOT upload this to GitHub!)\n")
