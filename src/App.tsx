import React, { useState } from "react";
import "./App.css";
import {
  FormGroup,
  Label,
  InputGroup,
  Button,
  H2,
  H6,
  Colors,
  IControlledProps,
  Spinner,
} from "@blueprintjs/core";
import parse from "url-parse";
import { SPOTIFY_AUTH_URL, GOOGLE_API_KEY } from "./public_ids";

const validatePlaylist = (url: string | undefined) => {
  if (!url) return undefined;
  let regExp = /^.*(youtu.be\/|list=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2]) {
    return match[2];
  }
  return undefined;
};

const googleURI = (id: string | undefined, nextPageToken: string | boolean) => {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${GOOGLE_API_KEY}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;
  return url;
};

const navToError = (err: any) =>
  (window.location.href = `${window.location.pathname}//${window.location.host}?error=${err.message}`);

const getPlaylistData = async (id: string | undefined) => {
  let playlistTitle = "";
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${id}&key=${GOOGLE_API_KEY}`
    );
    const resJSON = await res.json();
    console.log(resJSON);
    playlistTitle =
      resJSON.items[0].snippet.channelTitle +
      " - " +
      resJSON.items[0].snippet.localized.title;
  } catch (err) {
    navToError(err);
    return;
  }
  let songTitles: string[] = [];
  let notAll: any = 1;
  while (notAll === 1 || notAll) {
    try {
      const res = await fetch(googleURI(id, notAll !== 1 ? notAll : false));
      const resJSON = await res.json();
      notAll = resJSON.nextPageToken;
      resJSON.items.forEach((item: any) => {
        if (songTitles.length >= 100) return;
        songTitles.push(item.snippet.title);
      });
      if (songTitles.length >= 100) return;
    } catch (err) {
      navToError(err);
      return;
    }
  }
  return {
    title: playlistTitle,
    songs: songTitles,
  };
};

const getSpotifyId = async (access_token: string | null) => {
  let id;
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const resJSON = await res.json();
    id = resJSON.id;
  } catch (err) {
    navToError(err);
    return;
  }
  return id;
};

const convertToSpotify = async (
  access_token: string | null,
  title: any,
  songs: string[] | undefined
) => {
  try {
    if (!songs) throw new Error("no songs.");
    const user_id = await getSpotifyId(access_token);
    let res = await fetch(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
        }),
      }
    );
    let resJSON = await res.json();
    if (!resJSON.id) throw new Error("Creating a playlist failed.");
    const playlist_id = resJSON.id;
    let spotify_ids = [];
    let track_uri = "";
    for (let song of songs) {
      res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          song.split("(")[0]
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      resJSON = await res.json();
      if (resJSON.tracks && resJSON.tracks.items.length > 0) {
        track_uri = resJSON.tracks.items[0].uri;
        spotify_ids.push(track_uri);
      }
    }

    res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          uris: spotify_ids,
        }),
      }
    );
    return res.status;
  } catch (err) {
    console.log(err);
    // navToError(err);
    return;
  }
};

function App() {
  const [playlistData, setPlaylistData] = useState();
  const [loading, setLoading] = useState(false);
  const [playlistID, setPlaylistID] = useState();
  const [convertedStatus, setConvertedStatus] = useState("");

  const urlParse = parse(window.location.href, true);
  const { error } = urlParse.query;
  let access_token: string | null = urlParse.hash;

  if (access_token && access_token.split("=")[1]) {
    access_token = access_token.split("=")[1].split("&")[0];
  } else {
    access_token = "";
  }

  const disabled: boolean = error !== undefined || !access_token || loading;
  const correctID = playlistID && validatePlaylist(playlistID);
  const disabledPlaylist: boolean = disabled || !correctID || loading;

  return (
    <div className="App bp3-dark">
      {loading && (
        <div className="spinner-wrapper">
          <Spinner />
        </div>
      )}
      <FormGroup contentClassName="form-content">
        {error && <H6 style={{ color: Colors.RED5 }}>Error: {error}</H6>}
        <H2>Youtube to Spotify (BETA)</H2>
        <Button
          text="Link your Spotify account"
          onClick={() => {
            window.location.href = SPOTIFY_AUTH_URL;
          }}
          disabled={!disabled}
        />
        {!disabled && (
          <H6 style={{ color: Colors.GREEN5 }}>Spotify Account Linked.</H6>
        )}
        <Label required>
          Youtube Playlist URL:
          <InputGroup
            placeholder="https://www.youtube.com/playlist?list=PLfUPoZYoTuzLdzWITA7F51rrRSNh3DRz9"
            disabled={disabled}
            value={playlistID}
            onChange={(e: any) => {
              setPlaylistID(e.target.value);
            }}
            defaultValue={""}
          />
        </Label>
        {!playlistData ? (
          <Button
            text="Get playlist"
            onClick={async () => {
              setLoading(true);
              const resData = await getPlaylistData(correctID);
              setPlaylistData(resData);
              setLoading(false);
            }}
            disabled={disabledPlaylist}
          />
        ) : (
          <H6
            style={{ color: Colors.GREEN4 }}
          >{`Found ${playlistData.songs.length} songs (UP TO 100 FOR NOW) in playlist ${playlistData.title}.`}</H6>
        )}
        {!convertedStatus ? (
          <Button
            text="Convert"
            onClick={async () => {
              setLoading(true);
              let resStatus = await convertToSpotify(
                access_token,
                playlistData.title,
                playlistData.songs
              );
              setLoading(false);
              setConvertedStatus(`${resStatus}: conversion complete`);
            }}
            disabled={disabledPlaylist || !playlistData}
          />
        ) : (
          <H6 style={{ color: Colors.GREEN4 }}>{convertedStatus}</H6>
        )}
      </FormGroup>
    </div>
  );
}

export default App;
