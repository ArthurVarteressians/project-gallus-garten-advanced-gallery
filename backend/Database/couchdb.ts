import nano from "nano";

// CouchDB credentials
const username = "admin";
const password = "newpassword";
const serverIp = "89.250.70.201";
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
