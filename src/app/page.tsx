"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleLog = async () => {
    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to log message');
      }

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error('Error logging message:', error);
      setResponseMessage('Error logging message');
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message to log"
        />
        <button onClick={handleLog}>Log Message</button>
        {responseMessage && <p>{responseMessage}</p>}
      </main>
    </div>
  );
}