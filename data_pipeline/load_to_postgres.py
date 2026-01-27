import json
import psycopg2
import os
from dotenv import load_dotenv

# ---------- LOAD ENV ----------
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("❌ DATABASE_URL not found in .env file")

# ---------- CONNECT TO NEON ----------
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

print("✅ Connected to Neon database")

# ---------- INSERT ARTISTS ----------
with open("normalized_data/artists.json") as f:
    artists = json.load(f)

print("Number of artists loaded:", len(artists))

for artist in artists:
    cursor.execute(
        """
        INSERT INTO artists (artist_id, name, popularity)
        VALUES (%s, %s, %s)
        ON CONFLICT (artist_id) DO NOTHING
        """,
        (artist["artist_id"], artist["name"], artist["popularity"])
    )

conn.commit()
print("✅ Artists insertion done.")


# ---------- INSERT GENRES ----------
with open("normalized_data/genres.json") as f:
    genres = json.load(f)

print("Number of genres loaded:", len(genres))

for g in genres:
    cursor.execute(
        """
        INSERT INTO genres (genre)
        VALUES (%s)
        ON CONFLICT (genre) DO NOTHING
        """,
        (g["genre"].lower(),)
    )

conn.commit()
print("✅ Genres insertion done.")


# ---------- INSERT SONGS ----------
with open("normalized_data/songs.json") as f:
    songs = json.load(f)

print("Number of songs loaded:", len(songs))

for song in songs:
    cursor.execute(
        """
        INSERT INTO songs (song_id, name, popularity)
        VALUES (%s, %s, %s)
        ON CONFLICT (song_id) DO NOTHING
        """,
        (song["song_id"], song["name"], song["popularity"])
    )

conn.commit()
print("✅ Songs insertion done.")


# ---------- INSERT ARTIST_GENRES ----------
with open("normalized_data/genres.json") as f:
    genres = json.load(f)

pairs = 0
for g in genres:
    for artist_id in g["artist_ids"]:
        cursor.execute(
            """
            INSERT INTO artist_genres (artist_id, genre)
            VALUES (%s, %s)
            ON CONFLICT (artist_id, genre) DO NOTHING
            """,
            (artist_id, g["genre"].lower())
        )
        pairs += 1

conn.commit()
print("✅ Artist–Genres inserted:", pairs)


# ---------- ENSURE ALL SONG ARTISTS EXIST ----------
with open("normalized_data/songs.json") as f:
    songs = json.load(f)

for song in songs:
    for artist_id in song["artist_ids"]:
        cursor.execute(
            """
            INSERT INTO artists (artist_id, name, popularity)
            VALUES (%s, %s, %s)
            ON CONFLICT (artist_id) DO NOTHING
            """,
            (artist_id, "Unknown Artist", 0)
        )

conn.commit()
print("✅ Missing artists handled.")


# ---------- INSERT SONG_ARTISTS ----------
with open("normalized_data/songs.json") as f:
    songs = json.load(f)

pairs = 0
for song in songs:
    for artist_id in song["artist_ids"]:
        cursor.execute(
            """
            INSERT INTO song_artists (song_id, artist_id)
            VALUES (%s, %s)
            ON CONFLICT (song_id, artist_id) DO NOTHING
            """,
            (song["song_id"], artist_id)
        )
        pairs += 1

conn.commit()
print("✅ Song–Artists inserted:", pairs)


# ---------- CLOSE CONNECTION ----------
cursor.close()
conn.close()

print("🎉 ETL load_to_postgres completed successfully.")
