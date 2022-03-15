# Zepton

A small and flexible Javascript library for building user interfaces.

- Small: All features you expect from a modern framework in a very small package. < 5 kb minified and gzipped.
- Flexible: Uses a simple interface. Write your components in plain Javascript and build interfaces your own way.
- No virtual DOM: No compilation, no virtual DOM and a small runtime means your apps are small and fast.

## Installation
### CDN

You can get the zepton file from CDN and use it in your html file.

```html
<script src="https://unpkg.com/zepton/zepton.js"></script>
```

### Build tools

To use it with a build tool like vite for example (which is recommended), first create the project by running

```shell
$ npm create vite@latest
```

Then install Zepton.

```shell
$ npm install zepton --save
```

Then empty the main.js file and paste the following code:

```javascript
import { createApp, render, $} from 'zepton';

function MainComponent() {
  const template = $('h1', 'Hello World');

  return render({ template };
}

Zepton({
  root: '#app',
  component: MainComponent
});
```

### Using degit

You can scaffold a Zepton project from the template using degit. Run the following command in your commandline

```shell
$ npx degit AmeenAhmed/zepton-template my-zepton-project
$ cd my-zepton-project
$ npm install
$ npm run dev
```

----------

## Documentation
- Read the Zepton [documentation](https://www.zeptonjs.org/docs) page.
- Try the [examples](https://www.zeptonjs.org/examples) on the zepton website.
- The [tutorial](https://www.zeptonjs.org/tutorial) page guides you through the features of Zepton.
- The Zepton website has a [playground](https://www.zeptonjs.org/examples) where you can try Zepton on your own.

## License
Zepton is [MIT licensed](./LICENSE).
