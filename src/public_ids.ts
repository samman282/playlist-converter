export const SPOTIFY_CLIENT_ID = "c966a36c88d04effadd9a51ea43a144c";
export const SPOTIFY_SCOPES = encodeURIComponent(
  "playlist-modify-public playlist-read-collaborative"
);
export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${
  window.location.protocol + "//" + window.location.host
}&scope=${SPOTIFY_SCOPES}&response_type=token`;

export const GOOGLE_API_KEY = `AIzaSyBYBfE9rxBHVds_OdWo9uGGILVu7JpzFlA`;
