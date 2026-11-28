import * as THREE from 'three'

export function setupSceneLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
  scene.add(ambientLight)

  const rimLight = new THREE.DirectionalLight(0x94a3b8, 3.5)
  rimLight.position.set(-0.05, 0.05, 0.04)
  scene.add(rimLight)

  const frontLight = new THREE.DirectionalLight(0xffffff, 2.0)
  frontLight.position.set(0.05, -0.05, 0.06)
  scene.add(frontLight)
}

export function disposeThreeScene(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
      child.geometry?.dispose()
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => m?.dispose())
    }
  })
}
