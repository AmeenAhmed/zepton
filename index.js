import Zepton, { Render, State, $, $if, $each } from './zepton.js';

function main() {
  const state = State({
    count: 0,
    nums: [1, 2, 3],
    games: [
      { id: '1', name: 'Civilization 5' },
      { id: '2', name: 'Europa Universalis 4' },
      { id: '3', name: 'Dwarf fortress' }
    ]
  });

  setInterval(_ => {
    // state.count ++;
    // state.nums.push(state.nums.length + 1);
  }, 1000);

  const template = $('.main-component', 
    $('.count', 'Count => ', _ => state.count),
    $if(_ => state.count < 10, _ => [
        $if(_ => state.count < 5, _ => {
          return [
            'Count is less than 5'
          ];
        }).$else(_ => {
          return [
            'Count is less than 10'
          ];
        })
    ]).$elseif(_ => state.count < 20, _ => [
        'Count is greater than or equal to 10 and less than 20'
    ]).$else(_ => [
        'Count is greater than 20'
    ]),
    $each(state.nums, (item, index) => [
      $('.num', item),
      // 'Hello world',
      // _ => state.count
    ]),
    $('.games',
      $each(state.games, item => item.id, (item, index) => [
        $('.game', _ => index() + 1, '. ', _ => item().name, { flip: { duration: 200 } }),
      ])
    ),
    $('.buttons', $('button', 'Reverse', { $click: ev => state.games.reverse() }))
  );

  return Render({ state, template });
}

const App = new Zepton({
  root: '#root',
  component: main
});
