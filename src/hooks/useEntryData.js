import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

// Cache for entry configs to avoid redundant fetches
const configCache = new Map();

/**
 * Custom hook to manage entry data loading and state using the hybrid approach
 * 
 * @param {number} initialCount - Number of entries to load initially
 * @returns {Object} - Object containing entries data and functions
 */
export function useEntryData(initialCount = 3) {
  // State for all entries from entries.csv
  const [allEntries, setAllEntries] = useState([]);
  
  // State for entries that have been loaded with their config
  const [visibleEntries, setVisibleEntries] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch and parse a CSV file
  const fetchCSV = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      
      const text = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error)
        });
      });
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }, []);
  
  // Function to get a random entry or a specific one by name
  const getEntry = useCallback((entryName = null) => {
    if (!allEntries.length) return null;
    
    if (entryName) {
      const foundEntry = allEntries.find(entry => entry.foldername === entryName);
      return foundEntry || allEntries[Math.floor(Math.random() * allEntries.length)];
    }
    
    return allEntries[Math.floor(Math.random() * allEntries.length)];
  }, [allEntries]);
  
  // Function to load entry data with its config
  const loadEntry = useCallback(async (entry) => {
    if (!entry) return null;
    
    // Construct folder path
    const folderPath = `/entries/${entry.type}s/${entry.foldername}/`;
    
    try {
      // Fetch the config.json for this entry
      const configPath = `${folderPath}config.json`;
      
      // Check cache first
      if (configCache.has(configPath)) {
        return {
          ...entry,
          folderPath,
          config: configCache.get(configPath)
        };
      }
      
      const response = await fetch(configPath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch config for ${entry.name}: ${response.status}`);
      }
      
      const config = await response.json();
      configCache.set(configPath, config);
      
      return {
        ...entry,
        folderPath,
        config
      };
    } catch (error) {
      console.error(`Error loading config for ${entry.name}:`, error);
      return null;
    }
  }, []);
  
  // Function to load more entries
  const loadMoreEntries = useCallback(async (count = 1) => {
    setLoading(true);
    
    // Get entries that aren't already visible
    const nonVisibleEntries = allEntries.filter(
      entry => !visibleEntries.some(ve => ve.foldername === entry.foldername)
    );
    
    // If no more entries to load, return
    if (nonVisibleEntries.length === 0) {
      setLoading(false);
      return;
    }
    
    // Load random entries from non-visible ones
    const newEntriesPromises = [];
    for (let i = 0; i < count && i < nonVisibleEntries.length; i++) {
      const randomIndex = Math.floor(Math.random() * nonVisibleEntries.length);
      const randomEntry = nonVisibleEntries[randomIndex];
      nonVisibleEntries.splice(randomIndex, 1); // Remove to avoid duplicates
      
      newEntriesPromises.push(loadEntry(randomEntry));
    }
    
    // Wait for all entries to load
    const newEntries = (await Promise.all(newEntriesPromises)).filter(Boolean);
    
    // Update visible entries
    setVisibleEntries(prev => [...prev, ...newEntries]);
    setLoading(false);
  }, [allEntries, visibleEntries, loadEntry]);
  
  // Function to load a specific entry by foldername
  const loadEntryByName = useCallback(async (entryFolderName) => {
    // Check if already loaded
    if (visibleEntries.some(entry => entry.foldername === entryFolderName)) {
      return;
    }
    
    const entry = getEntry(entryFolderName);
    if (!entry) {
      console.warn(`Entry not found: ${entryFolderName}`);
      return;
    }
    
    const loadedEntry = await loadEntry(entry);
    if (loadedEntry) {
      setVisibleEntries(prev => [...prev, loadedEntry]);
    }
  }, [visibleEntries, getEntry, loadEntry]);
  
  // Fetch entries.csv on mount and load initial entries
  useEffect(() => {
    async function fetchEntriesAndLoadInitial() {
      try {
        setLoading(true);
        
        // Fetch entries data
        const entriesData = await fetchCSV('/entries.csv');
        setAllEntries(entriesData);
        
        // Load initial entries
        const initialEntryPromises = [];
        for (let i = 0; i < initialCount && i < entriesData.length; i++) {
          initialEntryPromises.push(loadEntry(entriesData[i]));
        }
        
        // Filter out null entries (in case some config files couldn't be loaded)
        const loadedEntries = (await Promise.all(initialEntryPromises)).filter(Boolean);
        setVisibleEntries(loadedEntries);
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    
    fetchEntriesAndLoadInitial();
  }, [fetchCSV, loadEntry, initialCount]);
  
  return {
    allEntries,
    visibleEntries,
    loading,
    error,
    loadMoreEntries,
    loadEntryByName
  };
}

export default useEntryData;