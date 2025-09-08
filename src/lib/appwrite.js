// src/lib/appwrite.js

import { Client, Databases, Query } from "appwrite";

// Init your Web SDK
export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('65886136b0ce70feb607');         // Your project ID

const dbId = '673066a80001cbe5501c';
const videosCollectionId = '673066b4002f6532e069';
const usersCollectionId = '6732f6700009408439a1'

export const databases = new Databases(client);

export const fetchVideos = async () => {
  try {
    const result = await databases.listDocuments(dbId, videosCollectionId, [
      Query.limit(1000)
    ]);
    return result.documents;  // Return the entire result object
  } catch (error) {
    console.error('Error fetching videos from Appwrite:', error);
    throw error;  // Throw the error for better error handling
  }
};



export const fetchLimited = async () => {
  try {
    const result = await databases.listDocuments(dbId, videosCollectionId, [
      Query.limit(4)
    ]);
    return result.documents;  // Return the entire result object
  } catch (error) {
    console.error('Error fetching videos from Appwrite:', error);
    throw error;  // Throw the error for better error handling
  }
};



export const fetchSingleOfVideo = async (category, id) => {
    try {
      const result = await databases.listDocuments(dbId, videosCollectionId, [
        Query.equal('$id', id)
      ]);
      return result.documents[0];  // Return the entire result object
    } catch (error) {
      console.error('Error fetching videos from Appwrite:', error);
      throw error;  // Throw the error for better error handling
    }
  };


