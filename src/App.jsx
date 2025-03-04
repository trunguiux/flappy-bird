import Game from './components/Game';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <Game />
    </div>
  );
}

export default App; 