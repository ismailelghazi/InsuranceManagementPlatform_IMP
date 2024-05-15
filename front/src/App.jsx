<<<<<<< HEAD
function App() {
  return (
    <div>
      test
=======
import logo from './logo.svg';
import styles from './App.module.css';

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
>>>>>>> 31488cce3e1fcecd751e203b19cd5c5f139d28c4
    </div>
  );
}

export default App;
