import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleAddRepository(event) {
    event.preventDefault();

    const response = await api.post('/repositories', { title: text });
    const newRepository = response.data;

    setText('');
    setRepositories([...repositories, newRepository])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`).then(() => {
      const newRepositories = repositories.filter(repository => repository.id !== id);

      setRepositories(newRepositories)
    }) 
  }

  return (
    <div>
      <form>
        <input value={text} onChange={event => setText(event.target.value)} />
        <button onClick={handleAddRepository}>Adicionar</button>
      </form>
      <ul data-testid="repository-list">
        {
          repositories.map(repository =>
            <li key={repository.title}>
              <a href={repository.url}>
                {repository.title}
              </a>

              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          )
        }
      </ul>
    </div>
  );
}

export default App;
