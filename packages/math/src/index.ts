import {show} from "@core/console";

/**
 * Sum two values
 */
export function add(a:number, b:number):void {
  var msg = `${a} + ${b} = ${a+b}`;
  show(msg);
}

/**
 * Diff two values
 */
 export function sub(a:number, b:number):void {
  var msg = `${a} - ${b} = ${a-b}`;
  show(msg);
}

/**
 * Division two values
 */
 export function div(a:number, b:number):void {
  var msg = `${a} / ${b} = ${a/b}`;
  show(msg);
}

/**
 * multiple two values
 */
 export function multiple(a:number, b:number):void {
  var msg = `${a} * ${b} = ${a*b}`;
  show(msg);
}

