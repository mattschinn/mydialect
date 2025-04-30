// src/utils/configManager.js
import Papa from 'papaparse';

// Helper function to parse CSV text
function parseCsv(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export async function getEntryIndex() {
  const response = await fetch('/entries.csv');
  const text = await response.text();
  return parseCsv(text);
}

export async function getEntryConfig(entryType, folderName) {
  const path = `/entries/${entryType}s/${folderName}/config.json`;
  const response = await fetch(path);
  return response.json();
}

export async function getVisibleEntries(visibleEntryIds) {
  return Promise.all(
    visibleEntryIds.map(id => {
      const [entryType, folderName] = id.split('/');
      return getEntryConfig(entryType, folderName);
    })
  );
}