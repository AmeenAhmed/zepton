import { Zepton, Render, $, $t, State, $if, $each, $transition } from './zepton.js';


const child = ({ count }) => {
  return Render({
    template: $('.child-component', {
      $: [
        $('h1', {
          $: [
            $t('This is the child component')
          ]
        }),
        $t(_ => count())
      ]
    })
  });
}

const main = () => {
  const state = new State({
    message: '',
    count: 0,
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    menu: [
      { id: 'cs', name: 'Chicken sandwich', price: 3 },
      { id: 'cb', name: 'Cheese burger', price: 5 },
      { id: 'fr', name: 'Fries', price: 2.5 }
    ],
    switch: true
  });


  setInterval(() => {
    // state.count += 1;
    // state.items[0] += 1;
    // state.items.reverse();
    // state.items.push(state.items.length + 1);
  }, 1000);

  setTimeout(() => {
    // state.menu.push({ id: 'ms', name: 'Milkshake', price: 2 });
    // state.menu.unshift({ id: 'ms', name: 'Milkshake', price: 2 });
    // state.menu.pop();
    // state.menu.shift();
    // state.menu.splice(1, 1);
    // state.menu.splice(1, 0, { id: 'ms', name: 'Milkshake', price: 2 });
    // state.menu.reverse();
    // state.menu.sort((a, b) => a.price - b.price);
    // state.menu[0].name = 'Chicken sandwich supreme';
  }, 1000);


  function fade({ delay = 0, duration = 400, easing = 'ease-in-out'} = {}) {
    return {
      delay,
      duration,
      easing,
      in: {
        opacity: [0, 1],
        transform: ['scale(0)', 'scale(1)']
      },
      out: {
        opacity: [0, 1],
        transform: ['scale(1)', 'scale(1)']
      }
    };
  }

  return Render({
    state,
    template: $('.main-component', {
      $: [
        $('h1', {
          $: [ $t('Main Component') ]
        }),
        $('input[type=text]', {
          on: {
            input: ev => state.message = ev.target.value
          }
        }),
        $t(_ => state.message),
        $('div', {
          $: [ $t('Count : '), $t(_ => state.count)],
          _: {
            class: _ => `count-${state.count}`
          }
        }),
        $if(_ => state.count < 5, _ => {
          return [
            $('.if-block', {
              $: [ $t('Count < 5') ]
            })
          ];
        }).$elseif(_ => state.count < 10, _ => {
          return [
            $('.else-if-block', {
              $: [ $t('Count < 10') ]
            })
          ];
        }).$else(_ => {
          return [
            $('.else-block', {
              $: [ $t('Count >= 10') ]
            })
          ];
        }),
        $('.buttons', {
          $: [
            $('button', {
              $: [
                $t('Click here')
              ],
              on: {
                click: ev => console.log(`clicked here when the count is ${state.count}`)
              }
            })
          ]
        }),
        $each(state.items, (item, index) => {
          return [
            $('.each-item', {
              $: [ 
                $t(_ => index() + '. '),
                $t(_ => item()) 
              ],
              transition: {
                fn: fade
              }
            }),
          ];
        }),
        $each(state.menu, item => item.id, (item, index) => {
          return [
            $('.each-item', {
              $: [
                $t(_ => (index() + 1) + '. '),
                $t(_ => item().name),
                $t(' ==> '),
                $t(_ => `$${item().price}`)
              ],
              transition: {
                fn: fade
              }
            })
          ];
        }),
        child({ count: _ => state.count }),
        child({ count: _ => state.count + 1 }),
        $('.transition-test', {
          $: [
            $('button', {
              $: [ $t('Switch') ],
              on: { click: ev => state.switch = !state.switch }
            }),
            $if(_ => state.switch, _ => [
              $('.switch', {
                $: [ $t('On') ],
                transition: {
                  fn: fade,
                  _: {
                    duration: 200
                  }
                }
              }) 
            ]).$else(_ => [
              $('.switch', {
                $: [ $t('Off') ],
                transition: {
                  fn: fade,
                  _: {
                    duration: 200
                  }
                }
              })
            ]),
          ]
        })
      ]
    })
  });
}

const App = new Zepton({
  root: '#root',
  component: main
});
