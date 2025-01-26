import nano from "nano";

// CouchDB credentials
const username = "admin";
const password = "****";
const serverIp = "****";
const port = "5984";

// Database URL
const dbUrl = `http://${username}:${encodeURIComponent(password)}@${serverIp}:${port}`;

// Initialize CouchDB connection
const couch = nano(dbUrl);

// Function to get a database instance
const useDatabase = (dbName: string) => {
  return couch.use(dbName);
};

export { useDatabase };
