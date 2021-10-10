type Properties<T> = Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>

export type GLFunction = <TElement>(canvas: TElement) => Promise<Renderer>

export type Renderer = Pick<THREE.WebGLRenderer, 'setSize' | 'getSize'> & {
  render: (scene: THREE.Scene, camera: THREE.Camera) => void
}

export type GLRenderer = Renderer & { [key: string]: any }

export type GLWebProps = Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>
