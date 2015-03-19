### layout-changes.js

> Watch a DOM element's tree for layout changes and resizes, using a animationFrame (Shim) listener only until the element is on the DOM or event listener has been removed. May be used to handle layouts in which elements change frequently (CSS changes, content changes, images loaded, etc...)

#### Install

From npm:

```bash
npm install --save layout-changes
```

#### Usage

```javascript
var layoutChanges = require('layout-changes'),
    element = document.getElementById('foobar');

layoutChanges.addListener(element, function (el) {
    console.log('Element or an element\'s child has changed size or content', el);
});
```

#### Methods

* `addListener(element, callback)` Add a listener to given element to trigger callback
* `removeListener(element, callback)` Remove a previously assigned listener

#### Licence

Copyright (c) 2015 Kano Computing Ltd. - Released under the [MIT license](https://github.com/KanoComputing/layout-changes-js/blob/master/LICENSE)