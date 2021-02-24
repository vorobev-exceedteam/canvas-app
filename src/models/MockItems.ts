import CanvasItemModel from './CanvasItemModel';

const item1 = 'M 0 0 L 40 5 V 145';
const item2 = 'M 100 100 V 0 H 200 V 100';
const item3 = 'M 0 0 A 25 25 90 0 0 25 50 A 25 25 90 0 0 0 0';
const item4 = 'M 0 131.25 L 105 131.25 L 52.5 26.25'
const item5 = 'M 0 0 L 192.5 0 C 157.5 23.3327 70 0 87.5 70'
const item6 = 'M 0 0 A 33.6 33.6 90 0 0 0 134.4';
const item7 = 'M 0 0 V 144 Q 96 96 192 192'

const mockItems: CanvasItemModel[] = [
  new CanvasItemModel(item1, 0, 0, 'red'),
  new CanvasItemModel(item2, 150, 150),
  new CanvasItemModel(item3, 200, 350, 'green'),
  new CanvasItemModel(item4, 500, 410, 'blue'),
  new CanvasItemModel(item5, 400, 400, 'orange'),
  new CanvasItemModel(item6, 500, 500, 'darkcyan'),
  new CanvasItemModel(item7, 600, 10, 'yellow')
];

export default mockItems
