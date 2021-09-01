import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: '#2c3e50';
  font-size: 20px;
`;

const AppLogo = styled.img`
  height: 200px;
  pointer-events: none;
`;

const Responses = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const statusColor = {
  loading: '#5dade2',
  online: '#58d68d',
  error: '#ec7063',
  timeout: '#f4d03f',
  offline: '#aab7b8',
}

const statusEmoji = {
  loading: '🕑',
  online: '✅',
  error: '🆘',
  timeout: '💀',
  offline: '📴',
}

const ResponseItem = styled.li`
  border: 1px solid transparent;
  border-radius: 4px;
  border-color: #ccc;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  padding: 3px;
  margin-right: 5px;
  margin-top: 5px;
  /* font-weight: bold; */
  background-color: ${(props) => statusColor[props.status]};
`;

const Response = ({ result }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const waitForData = async () => {
      let response;
      let jsonData
      try {
        response = await result;
        const { status, emoji } = await response.json();
        jsonData = {
          status,
          emoji
        }
      } catch {
        jsonData = { 
          status: 'timeout'
        }
      }
      if (!response || !jsonData) {
        return setData({
          status: 'clientError',
        });
      }
      setData({
        statusCode: response.status,
        ...jsonData
      });
    } 
    waitForData();
  }, [result])

  const status = data ? data.status : 'loading'

  return (
    <ResponseItem status={status}>
      {statusEmoji[status]} 
      {data ? <code>{`${JSON.stringify(data)}`}</code> : 'loading'}
    </ResponseItem>
  )
  
}

const App = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (results.length < 100) {
      setTimeout(() => {
        setResults([
          ...results,
          fetch('http://localhost:5000/status'),
        ])
      }, 1000);
    }
  }, [results]);

  return (
    <Container>
      <AppLogo src={logo} alt="logo" />
      <Responses>
        {results.map((result, index) => 
          <Response key={index} result={result} />)
        }
      </Responses>
    </Container>
  );
}

export default App;
