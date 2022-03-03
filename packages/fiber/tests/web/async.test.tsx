jest.mock('scheduler', () => require('scheduler/unstable_mock'))

import * as React from 'react'
import { Group, Camera, Scene, Raycaster, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three'
// @ts-ignore
import * as Stdlib from 'three-stdlib'
import { createCanvas } from '@react-three/test-renderer/src/createTestCanvas'
import { createWebGLContext } from '@react-three/test-renderer/src/createWebGLContext'

import { asyncUtils } from '../../../shared/asyncUtils2'

import { render, advance, useLoader, act, useThree, useGraph, useFrame, ObjectMap } from '../../src/web/index'

describe('web hooks', () => {
  let canvas: HTMLCanvasElement = null!

  beforeEach(() => {
    canvas = createCanvas({
      beforeReturn: (canvas) => {
        //@ts-ignore
        canvas.getContext = (type: string) => {
          if (type === 'webgl' || type === 'webgl2') {
            return createWebGLContext(canvas)
          }
        }
      },
    })
  })

  it('can handle useLoader hook', async () => {
    const MockMesh = new Mesh()

    // @ts-ignore
    jest.spyOn(Stdlib, 'GLTFLoader').mockImplementation(() => ({
      load: jest.fn().mockImplementation((url, onLoad) => {
        setTimeout(() => onLoad(MockMesh), 100)
      }),
    }))
    const Component = () => {
      // @ts-ignore
      const model = useLoader(Stdlib.GLTFLoader, '/suzanne.glb')
      return <primitive object={model} />
    }
    let scene: Scene = null!
    const { waitFor } = asyncUtils(act, async () => {
      scene = render(
        <React.Suspense fallback={null}>
          <Component />
        </React.Suspense>,
        canvas,
      ).getState().scene
    })
    await waitFor(() => {
      expect(scene.children[0]).toBe(MockMesh)
    })
    expect(scene.children[0]).toBe(MockMesh)
  })
})
