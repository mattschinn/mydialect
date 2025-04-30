import React from 'react';
import EntryList from './components/EntryList';
import useEntryData from './hooks/useEntryData';
import './styles/App.css';

function App() {
  const { 
    visibleEntries, 
    loading, 
    error, 
    loadMoreEntries, 
    loadEntryByName
  } = useEntryData(3); // Load 3 entries initially
  
  if (loading && visibleEntries.length === 0) {
    return <div className="loading">Loading entries...</div>;
  }
  
  if (error && visibleEntries.length === 0) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>***</h1>
      
      <EntryList 
        entries={visibleEntries}
        onLoadMore={() => loadMoreEntries(1)}
        onRefLink={loadEntryByName}
        loading={loading}
      />
    </div>
  );
}

export default App;