import * as THREE from 'three'

import { is } from '../core/is'
import { isRenderer, ApplyProps } from '../core/store'

import { GLFunction, GLRenderer, GLWebProps, Renderer } from '../types/renderer'

/**
 * Accepts a function that should return a renderer
 */
export async function createRendererInstance<TGLFunction extends GLFunction, TElement extends HTMLCanvasElement>(
  gl: TGLFunction,
  canvas: TElement,
  applyProps: ApplyProps,
): Promise<ReturnType<TGLFunction>>
/**
 * Accepts a renderer
 */
export async function createRendererInstance<TElement extends HTMLCanvasElement>(
  gl: GLRenderer,
  canvas: TElement,
  applyProps: ApplyProps,
): Promise<Renderer>
/**
 * Accepts props to be passed to THREE.WebGLRenderer
 */
export async function createRendererInstance<TElement extends HTMLCanvasElement>(
  gl: GLWebProps,
  canvas: TElement,
  applyProps: ApplyProps,
): Promise<THREE.WebGLRenderer>

export async function createRendererInstance(gl: any, canvas: any, applyProps: any) {
  let p: Promise<any> = Promise.resolve()
  if (is.fun(gl)) {
    p = p.then(() => Promise.all(gl(canvas)))
  } else if (isRenderer(gl)) {
    await p
    return gl
  }

  const renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    canvas,
    antialias: true,
    alpha: true,
    ...gl,
  })
  if (gl) applyProps(renderer as any, gl as any)

  await p
  return renderer
}
