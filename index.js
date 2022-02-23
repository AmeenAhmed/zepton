import { createApp, createState, render, $, $component } from './zepton.js';

function Comp1 () {
  const template = $('h1', 'Comp1');

  return render({ template });
}

function Comp2 () {
  const template = $('h1', 'Comp2');

  return render({ template });
}

function Main() {
  const state = createState({ count: 0 });
	const template = $('.view', $component(_ => Comp1));

  setInterval(_ => state.count ++, 1000);

	return render({ state, template });
}

createApp({
  root: '#root',
  component: Main
})
