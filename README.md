# Demo of the project
Demo of the project you can find [here](https://vorobev-exceedteam.github.io/canvas-app/)

# How to run this project locally
To run development server, enter:

### `npm start`

then open [this](http://localhost:3000/)


To get built version, type this:

### `npm run build`

then build directory in project folder will appear

# How JSON of a custom item should look

JSON should contain the following fields:

* xLoc - location of the item on x-axis in px;
* yLoc - location of the item on y-axis in px;
* svg - path string of svg;
* color - color of the item;
 
Example of json file with custom items

```json
[
  {
    "xLoc": 400, 
    "yLoc": 100, 
    "svg": "M 0 0 V 280 Q 252 323 138 237 C -64 196 96 108 0 0", 
    "color": "brown"
  },
  {
    "xLoc": 200,
    "yLoc": 60,
    "svg": "M 0 0 V 100 Q 232 323 138 237 C -74 196 96 108 0 0",
    "color": "red"
  }
]
```


# Features that have been implemented
* Import and export of objects
* Moving objects with a mouse (click and drag)
* All objects are selectable through `CTRL+CLICK` (hold `CTRL+CLICK` to move selected objects around)
* Feature to delete selected objects (select items and then press the `DELETE` button)
* Persistence of the canvas state in a browser's local storage (click the `Save As Default` button, to save current state of objects)
* History module (you can undo your changes and reset to initial state)
