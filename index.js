import { createApp, createState, render, $, $if, $component } from './zepton.js';
import { slideDown, slideRight } from './transitions.js';

/*
function Comp1 () {
  const template = $('h1', 'Comp1');

  return render({ template });
}

function Comp2 () {
  const template = $('h1', 'Comp2');

  return render({ template });
}

*/

function Main() {
  const state = createState({ isVisible: true });
	const template = $('.view',
    $('input[type=checkbox]', { checked: true, $input: ev => state.isVisible = !state.isVisible }),
    $('label', 'Check'),
    $if(_ => state.isVisible, _ => [
      $('.msg', 'Hello world', { in: { fn: slideDown }, out: { fn: slideRight } })
    ])
  );

  setInterval(_ => state.count ++, 1000);

	return render({ state, template });
}

createApp({
  root: '#root',
  component: Main
})
