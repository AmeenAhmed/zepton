
const isUndefined = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Undefined]';
}

const isNull = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Null]';
}

const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

const isFunction = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Function]';
}

const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === `[object Array]`;
}

const isString = (obj) => {
  return typeof obj === 'string';
}

const noop = (_ => _);

function parseSelector (selector) {
  let tagnameRegex = /^([a-zA-Z0-9_-]+)/g;
  let classesRegex = /\.([a-zA-Z0-9-_]+)/g;
  let idRegex = /#([a-zA-Z0-9-_]+)/g;
  let attribsRegex = /\[([^\]]+)/g;
  let tagname = '';
  let id = '';
  let classes = [];
  let attributes = [];
  let token;
  tagname = (token = tagnameRegex.exec (selector)) ? token [1] : 'div';
  while (!!(token = classesRegex.exec (selector))) classes.push (token [1]);
  id = (token = idRegex.exec (selector)) ? token [1] : '';
  while (!!(token = attribsRegex.exec (selector))) attributes.push ({ key: token [1].split ('=')[0], value: token [1].split ('=')[1] });
  return { tagname, id, classes, attributes};
}

function classHelper(cls) {
  if(isArray(cls)) {
    return cls.map(item => classHelper(item)).join(' ');
  } else if(isObject(cls)) {
    return Object.keys(cls).map(key => (isFunction(cls[key]) ? cls[key]() : !!cls[key]) ? key : '');
  } else {
    return cls;
  }
}

function compileClass(classes) {
  let result = '';

  for(const cls of classes) {
    if(isFunction(cls)) {
      result += `${classHelper(cls())} `
    } else if(isString(cls)) {
      result += `${classHelper(cls)} `;
    }
  }

  return result.trim();
}

function stylesHelper(style, node) {
  let result = '';
  if(isObject(style)) {
    for(const key in style) {
      if(node) {
        node.style[key] = style[key];
      }
      result += `${key}: ${style[key]}; `;
    }
  } else if(isString(style)) {
    if(node) {
      node.setAttribute('style', style);
    }
    result += style;
  }
  return result.trim();
}

function compileStyles(styles, node) {
  if(isFunction(styles)) {
    return stylesHelper(styles(), node);
  } else {
    return stylesHelper(styles, node);
  }
}

function doTransition(node, options, direction, cb) {
  const anim = options[direction];                                                                                                                      
  for(var key in anim) {
    node.style[key] = anim[key][0];
  }
  node.style.transitionDelay = `${options.delay}ms`;
  node.style.transitionDuration = `${options.duration}ms`;
  node.style.transitionTimingFunction = options.easing;
  node.style.transitionProperty = Object.keys(anim).join(', ');
  node.scrollWidth;
  for(var key in anim) {
    node.style[key] = anim[key][1];
  }
  node.ontransitionend = cb || noop; 
}

function doFLIP(node, options, startRect, endRect, cb) {
  const startX = startRect.x - endRect.x;
  const startY = startRect.y - endRect.y;
  const delay = options.delay || 0;
  const duration = options.duration || 400; 
  const easing = options.easing || 'ease-in-out';
  
  node.style.transition = 'none';
  node.style.transform = `translate(${startX}px, ${startY}px)`;
  node.scrollWidth;
  node.style.transitionDelay = `${delay}ms`;
  node.style.transitionDuration = `${duration}ms`;
  node.style.transitionTimingFunction = easing;
  node.style.transitionProperty = 'transform';
  node.scrollWidth;
  node.style.transform = 'translate(0,0)';
  node.ontransitionend = cb || noop; 
}

function Node(tagname, id, classes, attributes, events, children, transition, flip) {
  let node;

  const options = {
    class: '',
    id: '',
    styles: {},
    attributes: {}
  };

  const intro = (cb = noop) => {
    if(transition) {
      doTransition(node, transition.fn(transition._), 'in', cb);
    } else {
      cb();
    }
  }

  const outro = (cb = noop) => {
    if(transition) {
      doTransition(node, transition.fn(transition._), 'out', cb);
    } else {
      cb();
    }
  }

  const FLIP = (startRect, endRect, cb = noop) => {
    doFLIP(node, flip, startRect, endRect);
  }

  return {
    create() {
      node = document.createElement(tagname);
      if(id && isFunction(id)) {
        options.id = id();
      }

      if(id) {
        node.setAttribute('id', options.id);
      }

      options.class = compileClass(classes);

      if(options.class) {
        node.setAttribute('class', options.class);
      }

      for(const attr of attributes) {
        const { key, value } = attr;
        let result;

        if(key === 'style' && !isString(value)) {
          result = options.styles = { result: compileStyles(value, node), value};
        } else {
          if(isFunction(value)) {
            result = options.attributes[key] = { result: attr(), value};
          } else if(isString(value)) {
            result = value;
          }
          node.setAttribute(key, result);
        }
      }
      for(const key in events) {
        node.addEventListener(key, events[key]);
      }
      for(const child of children) {
        child.create();
      }
    },
    mount(_node) {
      for(const child of children) {
        child.mount(node);
      }

      _node.appendChild(node);

      intro();
    },
    update() {
      const $id = isFunction(id) ? id() : '';
      if($id !== options.id) {
        node.setAttribute('id', $id);
      }
      const cls = compileClass(classes);
      if(cls !== options.class) {
        node.setAttribute('class', cls);
      }
      for(const key in options.attributes) {
        const { result, value } = options.attributes[key];
        const newResult = value();
        if(result !== newResult) {
          node.setAttribute(key, newResult);
          options.attributes[key].result = newResult;
        }
      }
      if(options.styles && isFunction(options.styles.value)) {
        const { result, value } = options.styles;
        const newResult = compileStyles(value);
        if(result !== newResult) {
          compileStyles(value, node);
          options.styles.result = newResult;
        }
      }
      for(const child of children) {
        child.update();
      }
    },
    remove() {
      outro(_ => {
        node.remove();
        for(const child of children) {
          child.remove();
        }
      });
    },
    insertBefore(anchor) {
      for(const child of children) {
        child.mount(node);
      }

      let startRect, endRect, parentElement = node.parentElement;

      if(flip && parentElement) {
        startRect = node.getBoundingClientRect();
      }

      anchor.parentElement.insertBefore(node, anchor);

      if(flip && parentElement) {
        endRect = node.getBoundingClientRect();
        FLIP(startRect, endRect);
      } else {
        intro();
      }
    },
    get() {
      return node;
    },
    $$node: true
  }
}

export function $(selector, ...items) {
  let { tagname, id = '', classes = [], attributes = [] } = parseSelector(selector);
  let children = [];
  let events = {};
  let options = {};


  for(const item of items) {
    if(!isObject(item)) {
      children.push($t(item));
    } else {
      if(item.$$node) {
        children.push(item);
      } else {
        options = item;
      }
    }
  }
  
  for(const key in options) {
    if(key === 'class') {
      if(isArray(options[key])) {
        classes = [...classes, ...options[key]];
      } else {
        classes = [...classes, options[key]];
      }
    } else if(key.includes('on:')) {
      events[key.slice(3)] = options[key]
    } else if(key[0] === '$' && isFunction(options[key])) {
      events[key.slice(1)] = options[key]
    } else {
      attributes.push({ key, value: options[key] });
    }
  }

  return Node(tagname, id, classes, attributes, events, children, options.transition, options.flip);
}

export function $t(text) {
  let node;
  let $text = text;

  return {
    create() {
      if(isFunction(text)) {
        $text = '' + text();
      }
      node = document.createTextNode($text);
    },
    mount(_node) {
      _node.appendChild(node);
    },
    update() {
      if(isFunction(text)){
        const _text = '' + text();
        if(_text !== $text) {
          node.textContent = _text;
          $text = _text;
        }
      }
    },
    remove() {
      node.remove();
    },
    insertBefore(anchor) {
      anchor.parentElement.insertBefore(node, anchor);
    },
    get() {
      return node;
    }
  }
}

function correctNodes (nodes) {
  return nodes.map(item => {
    if(!isObject(item)) {
      return $t(item);
    }
    return item;
  });
}


export function $if(condition, block) {
  const ifs = [];
  let els = null;
  let currentBlock = null;
  let anchor = null;
  let nodes = [];
  let isMounted = false;
  let node;
  let isTransitioning = false;
  let transitioningNodes = [];

  const createNodes = () => {
    nodes.forEach(node => node.create());
    if(isMounted) {
      nodes.forEach(node => node.insertBefore(anchor));
    }
  }

  const removeNodes = () => {
    nodes.forEach(node => node.remove());
    nodes = [];
  }

  const updateFn = () => {
    for(let item of ifs) {
      if(item.condition()) {
        if(currentBlock !== item) {
          removeNodes();
          currentBlock = item;
          nodes = correctNodes(item.block());
          createNodes();
          return;
        }
        return;
      }
    }

    if(els) {
      if(currentBlock !== els) {
        removeNodes();
        currentBlock = els;
        nodes = correctNodes(els());
        createNodes(); 
        return;
      }
      return;
    }

    if(currentBlock) {
      removeNodes();
      currentBlock = null;
    }
  }

  node = {
    create() {
      anchor = document.createComment('');
      updateFn();
    },
    mount(_node) {
      _node.append(anchor);
      nodes.forEach(node => node.insertBefore(anchor));
      isMounted = true;
    },
    update() {
      updateFn();
      nodes.forEach(node => node.update());
    },
    remove() {
      removeNodes();
    },
    insertBefore(_anchor) {
      _anchor.parentElement.insertBefore(anchor, _anchor);
      nodes.forEach(node => node.insertBefore(anchor));
      isMounted = true;
    },
    $$node: true
  }

  const $elseif = (condition, block) => {
    ifs.push({ condition, block });
    return { $elseif, $else, ...node };
  };

  const $else = (block) => {
    els = block;

    return node;
  };

  ifs.push({ condition, block });

  

  return { $elseif, $else, ...node };
}

export function $each(list, key, block) {
  let anchor;
  let nodeLists = [];
  let $key = block ? key : null;
  let $block = block || key;
  let $list = $key ? {} : [...list];
  let length = list.length;
  let $itemsByIndex = {};
  let $nodesByIndex = {};
  let isMounted = false;

  if($key) {
    for(const [index, item] of list.entries()) {
      $list[$key(item)] = { item, index };
      $itemsByIndex[index] = item;
    }
  }
  
  const createFnByIndex = (i) => {
    const nodeList = correctNodes($block(_ => $list[i], _ => i));
    nodeList.forEach(node => {
      node.create();
      if(isMounted) {
        if(i === list.length - 1) {
          node.insertBefore(anchor);
        } else {
          node.insertBefore(nodeLists[i + 1][0].get());
        }
      }
    });
    return nodeList;
  }

  const createFnByKey = (key) => {
    const index = $list[key].index;
    const nodeList = correctNodes($block(_ => $list[key].item, _ => $list[key].index));
    $nodesByIndex[index] = nodeList;
    $list[key].nodeList = nodeList;
    nodeList.forEach(node => {
      node.create();
      if(isMounted) {
        if(index === list.length - 1) {
          node.insertBefore(anchor);
        } else {
          node.insertBefore(nodeLists[index + 1][0].get());
        }
      }
    });
    return nodeList;
  }

  return {
    $$node: true,
    create() {
      anchor = document.createComment('');
      for(let i=0; i<length; i++) {
        let nodeList;
        if($key) {
          nodeList = createFnByKey($key(list[i]));
        } else {
          nodeList = createFnByIndex(i);
        }
        nodeLists.push(nodeList);
      }
    },
    mount(_node) {
      _node.append(anchor);
      nodeLists.forEach(nodeList => nodeList.forEach(node => node.insertBefore(anchor)));
      isMounted = true;
    },
    insertBefore(_anchor) {
      _anchor.parentElement.insertBefore(anchor, _anchor);
      nodeLists.forEach(nodeList => nodeList.forEach(node => node.insertBefore(anchor)));
      isMounted = true;
    },
    remove() {
      nodeLists.forEach(nodeList => nodeList.forEach(node => node.remove()));
      node.remove();
      isMounted = false;
    },
    update() {
      if(!$key) {
        if(list.length < length) {
          const nodeList = nodeLists.pop();
          nodeList.forEach(node => node.remove());
        } else if(list.length > length) {
          const nodeList = createFnByIndex(list.length - 1);
          nodeLists.push(nodeList);
        }
        $list = [...list];
        length = list.length;
        nodeLists.forEach(nodeList => nodeList.forEach(node => node.update()));
      } else {
        const keys = {};
        for(let key in $list) {
          keys[key] = true;
        }
        length = list.length;
        for(let i=length - 1; i>= 0; i--) {
          const index = i;
          const item = list[index];
          const key = $key(list[i]);
          let obj = $list[key];

          if(!obj) {
            $list[key] = { item, index };
            nodeLists.splice(index, 0, null);
            const nodeList = createFnByKey(key);
            if(index === length - 1) {
              nodeList.forEach(item => item.insertBefore(anchor));
            } else {
              nodeList.forEach(item => item.insertBefore($nodesByIndex[index + 1][0].get()));
            }
            nodeLists[index] = nodeList;
            $nodesByIndex[index] = nodeList;
            $itemsByIndex[index] = item;
            length = list.length;
            obj = $list[key];
          }

          if(obj.index !== index) {
            $itemsByIndex[index] = item;
            $nodesByIndex[index] = $nodesByIndex[obj.index];
            obj.index = i;

            if(index === length - 1) {
              obj.nodeList.forEach(item => item.insertBefore(anchor));
            } else {
              obj.nodeList.forEach(item => item.insertBefore($nodesByIndex[index + 1][0].get()));
            }
          }

          delete keys[key];

          obj.nodeList.forEach(item => item.update());
        }

        for(let key in keys) {
          $list[key].nodeList.forEach(item => item.remove());
          delete $list[key];
        }
      }
    }
  }
}

export function $component(fn, props = {}) {
  const anchor = document.createComment('');
  let component = null;
  let componentInstance = null;

  return {
    create() {
      const comp = fn();
      component = comp;
      if(component) {
        componentInstance = component(props);
        componentInstance.create();
      }
    },
    mount(_node) {
      _node.append(anchor);
      if(componentInstance) {
        componentInstance.insertBefore(anchor);
      }
    },
    update() {
      const comp = fn();
      if(comp !== component) {
        if(componentInstance) {
          componentInstance.remove();
        }
        component = comp;
        if(component) {
          componentInstance = component(props);
          componentInstance.create();
          componentInstance.insertBefore(anchor);
        }
      }
    },
    insertBefore(_anchor) {
      _anchor.parentElement.insertBefore(anchor, _anchor);
      if(componentInstance) {
        componentInstance.insertBefore(anchor);
      }
    },
    remove() {
      anchor.remove();
      if(componentInstance) {
        componentInstance.remove();
      }
    },
    $$node: true
  };
}

export default function Zepton(options) {
  const root = document.querySelector(options.root);
  const componentInstance = options.component();
  componentInstance.create();
  componentInstance.mount(root);
}

export function Render(options) {
  const template = options.template;
  const style = options.style;
  const state = options.state;
  const mounted = options.mounted || noop;
  const beforeUpdate = options.beforeUpdate || noop;
  const updated = options.updated || noop;
  const beforeDestroy = options.beforeDestroy || noop;
  const destroyed = options.destroyed || noop;

  const component = {
    create() {
      template.create();
    },
    update() {
      beforeUpdate();
      template.update();
      updated();
    },
    mount(node) {
      template.mount(node);
      mounted();
    },
    remove() {
      beforeDestroy();
      template.remove();
      destroyed();
    },
    insertBefore(anchor) {
      template.insertBefore(anchor);
    },
    $$node: true
  };

  if(state) {
    let timeout = -1;

    state.$$invalidate = _ => {
      if(timeout !== -1) {
        console.log('Cannot invalidate!!');
      } else {
        timeout = setTimeout(_ => {
          component.update()
          timeout = -1;
        });
      }
    }
  }

  return component; 
}
  
export function Collection(_array, root) {
  if(isArray(_array)) {
    const $$invalidate = () => {
      if(root.$$invalidate) {
        root.$$invalidate();
      }
    }

    const itemConv = item => {
      if(isArray(item)) {
        return Collection(item, root);
      } else if(isObject(item)) {
        return State(item, root);
      }

      return item;
    }

    let array = _array.map(item => itemConv(item));

    array.push = function () {
      let items = Array.prototype.slice.apply(arguments);
      items = items.map(item => itemConv(item));
      Array.prototype.push.apply(array, items);
      $$invalidate();
      return array.length;
    }

    array.pop = function() {
      const value = Array.prototype.pop.apply(array, arguments);
      $$invalidate();
      return value;
    }

    array.unshift = function() {
      let items = Array.prototype.slice.apply(arguments);
      items = items.map(item => itemConv(item));
      Array.prototype.unshift.apply(array, items);
      $$invalidate();
      return array.length;
    }

    array.shift = function() {
      const value = Array.prototype.shift.apply(array, arguments);
      $$invalidate();
      return value;
    }

    array.reverse = function() {
      Array.prototype.reverse.apply(array, arguments);
      $$invalidate();
    }

    array.sort = function() {
      Array.prototype.sort.apply(array, arguments);
      $$invalidate();
    }

    array.splice = function(start, deleteCount, ...items) {
      items = items.map(item => itemConv(item));
      const args = [start, deleteCount, items];
      Array.prototype.splice.apply(array, args);
      $$invalidate();
    }

    array = new Proxy(array, {
      set: function(obj, prop, value) {
        obj[prop] = value;
        if(prop !== 'length') {
          $$invalidate();
        }
        return true;
      }
    });

    return array; 
  }
}

export function State (obj, root) {
  const state = {
  };
  root = root || state;

  for(let key in obj) {
    const value = obj[key];
    if(isArray(value)) {
      state[`$$${key}`] = Collection(value, state);
    } else if(isObject(value)) {
      state[`$$${key}`] = State(value, state);
    } else {
      state[`$$${key}`] = value;
    }
    Object.defineProperty(state, key, {
      get() {
        return state[`$$${key}`]
      },
      set(value) {
        state[`$$${key}`] = value;
        if(root.$$invalidate) {
          root.$$invalidate();
        }
      }
    })
  }
  return state;
}
