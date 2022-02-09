import Zepton from './zepton.js';


const main = () => {
  const template = $('main-component', 
    $('h1', 'Hello world'),
    $('input', { _: { type: 'text', placeholder: 'Enter text here...' } })
  );

  return Render({ template });
}


const App = new Zepton({
  root: '#root',
  component: main
});
