import React from 'react'

const Home = ({ userName }) => {
  const styles = {
    container: {
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      maxWidth: '400px',
      margin: '50px auto',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    subtitle: {
      fontSize: '18px',
      color: '#777',
    },
  };

  return (
    <div style={styles.container}>
      <p style={styles.title}>Welcome {userName}!</p>
      <p style={styles.subtitle}>You are logged in as Admin.</p>
    </div>
  )
}

export default Home;
