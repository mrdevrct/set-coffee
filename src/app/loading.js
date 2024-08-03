'use client'
import React, { useState, useEffect } from 'react';
import './globals.css'; // فایل CSS جداگانه

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: "منتظر بمانید درحال بارگذاری صفحه !" });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <h1>{data.message}</h1>
    </div>
  );
}

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
}

export default App;
