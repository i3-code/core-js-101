/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  data: {},

  error(code) {
    this.data = {};
    if (code) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  stringify() {
    let ret = '';
    if (this.data.combine) ret += this.data.combine;
    if (this.data.element) ret += this.data.element;
    if (this.data.id) ret += `#${this.data.id}`;
    if (this.data.attr) ret += `[${this.data.attr}]`;
    if (this.data.class) ret += this.data.class;
    if (this.data.pseudoClass) ret += this.data.pseudoClass;
    if (this.data.pseudoElement) ret += `::${this.data.pseudoElement}`;
    this.data = {};
    return ret;
  },

  element(value) {
    if (this.data.element) this.error();
    if (Object.keys(this.data).length) this.error(1);
    const ret = Object.create(cssSelectorBuilder);
    ret.data = {};
    ret.data.element = value;
    return ret;
  },

  id(value) {
    if (this.data.id) this.error();
    if (!this.data.element && Object.keys(this.data).length) this.error(1);
    const ret = Object.create(cssSelectorBuilder);
    ret.data = {};
    if (this.data.element) ret.data.element = this.data.element;
    ret.data.id = value;
    return ret;
  },

  class(value) {
    if (this.data.attr) this.error(1);
    if (!this.data.class) this.data.class = '';
    this.data.class += `.${value}`;
    return this;
  },

  attr(value) {
    if (this.data.pseudoClass) this.error(1);
    this.data.attr = value;
    return this;
  },

  pseudoClass(value) {
    if (this.data.pseudoElement) this.error(1);
    if (!this.data.pseudoClass) this.data.pseudoClass = '';
    this.data.pseudoClass += `:${value}`;
    return this;
  },

  pseudoElement(value) {
    if (this.data.pseudoElement) this.error(0);
    this.data.pseudoElement = value;
    return this;
  },

  combine(selector1, combinator, selector2) {
    const ret = Object.create(cssSelectorBuilder);
    ret.data = {};
    ret.data.combine = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return ret;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
