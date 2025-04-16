/**
 * Google Drive Authentication Configuration
 * 
 * This file centralizes the Google Drive API authentication configuration
 * using environment variables instead of a JSON key file.
 */

const { google } = require('googleapis');
const path = require('path');

// Create JWT auth client using environment variables
const createDriveAuth = () => {
  try {
    // Create a JWT auth client using service account credentials
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/drive']
    );

    return auth;
  } catch (error) {
    console.error('Error creating Google Drive auth client:', error);
    throw error;
  }
};

// Create and export Google Drive client
const getDriveClient = () => {
  const auth = createDriveAuth();
  return google.drive({ version: 'v3', auth });
};

module.exports = {
  createDriveAuth,
  getDriveClient
}; 