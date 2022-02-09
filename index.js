import Zepton, { Render, $, State, $if, $each } from './zepton.js';
import { fade } from './transitions.js';

const child = ({ count, slot, click = _ => _ }) => {
  return Render({
    template: $('.child-component', {
      $: [
        $('h1', {
          $: [
            'This is the child component'
          ]
        }),
        _ => count(),
        $('.slot', {
          $: [ slot ]
        }),
        $('.buttons', {
          $: [
            $('button', {
              $: [ 'click to emit' ],
              on: { click: ev => click('Clicked!') }
            })
          ]
        })
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
    state.count += 1;
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
  
  return Render({
    state,
    mounted() {
      // console.log('Component mounted!');
    },
    beforeUpdate() {
      // console.log('Component before update!');
    },
    updated() {
      // console.log('Component updated!');
    },
    beforeDestroy() {
      // console.log('Component before destroy!');
    },
    destroyed() {
      // console.log('Component updated!');
    },
    template: $('.main-component', {
      $: [
        $('h1', {
          $: [ 'Main Component' ]
        }),
        $('input[type=text]', {
          on: {
            input: ev => state.message = ev.target.value
          }
        }),
        _ => state.message,
        $('div', {
          $: [ 'Count : ', _ => state.count],
          _: {
            class: _ => [`count-${state.count}`, 'something', { onlyAfter20: _ => state.count > 20}],
            style: {
              background: 'black',
              color: 'white'
            }
          }
        }),
        $('.test-div', {
          $: [ 'Test div' ],
          _: {
            style: _ => state.count % 2 === 0 ? { background: 'black', color: 'white' } : { background: 'white', color: 'black' } 
          }
        }),
        $if(_ => state.count < 10, _ => {
          return [
            $('.if-block', {
              $: [ 
                $if(_ => state.count < 5, _ => [
                  $('.if-inner-block', {
                    $: [ 'Count < 5' ]
                  })
                ]).$else(_ => [
                  $('.else-inner-block', {
                    $: [ 'Count < 10' ]
                  })
                ]) 
              ]
            })
          ];
        }).$elseif(_ => state.count < 20, _ => {
          return [
            $('.else-if-block', {
              $: [ 'Count < 20' ]
            })
          ];
        }).$else(_ => {
          return [
            $('.else-block', {
              $: [ 'Count >= 20' ]
            })
          ];
        }),
        $('.buttons', {
          $: [
            $('button', {
              $: [
                'Click here'
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
                _ => index() + '. ',
                _ => item() 
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
                _ => (index() + 1) + '. ',
                _ => item().name,
                ' ==> ',
                _ => `$${item().price}`
              ],
              transition: {
                fn: fade
              },
              flip: {
                duration: 200,
                easing: 'ease-out'
              }
            })
          ];
        }),
        $('.list-buttons', {
          $: [
            $('button', {
              $: [ 'Shuffle' ],
              on: {
                click: ev => state.menu.reverse()
              }
            })
          ]
        }),
        child({ count: _ => state.count, slot: $('.slot-inside', { $: [ _ => `${state.count} inside slot` ] }), click: (msg) => console.log(msg) }),
        child({ count: _ => state.count + 1, slot: $('.slot-inside', { $: [ _ => `${state.count + 1} inside slot` ] }) }),
        $('.transition-test', {
          $: [
            $('button', {
              $: [ 'Switch' ],
              on: { click: ev => state.switch = !state.switch }
            }),
            $if(_ => state.switch, _ => [
              $('.switch', {
                $: [ 'On' ],
                transition: {
                  fn: fade,
                  _: {
                    duration: 200
                  }
                }
              }) 
            ]).$else(_ => [
              $('.switch', {
                $: [ 'Off' ],
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
