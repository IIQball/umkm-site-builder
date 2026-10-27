import * as THREE from 'three'
import gsap from 'gsap'
import { STAGES } from './synergy.data'

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

export function createCameraTimeline(
  containerElement: HTMLElement,
  cameraState: { x: number; y: number; z: number; lookX: number; lookY: number; lookZ: number },
  onStageChange: (stage: number) => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerElement,
      start: 'top top',
      end: '+=4000',
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress
        if (p < 0.20) {
          onStageChange(0)
        } else if (p < 0.40) {
          onStageChange(1)
        } else if (p < 0.60) {
          onStageChange(2)
        } else {
          onStageChange(3)
        }
      }
    }
  })

  tl.to(cameraState, {
    x: STAGES[0].camera.x,
    y: STAGES[0].camera.y,
    z: STAGES[0].camera.z,
    lookX: STAGES[0].lookAt.x,
    lookY: STAGES[0].lookAt.y,
    lookZ: STAGES[0].lookAt.z,
    duration: 0.10,
    ease: 'power2.out'
  }, 0.0)

  tl.to(cameraState, {
    x: STAGES[1].camera.x,
    y: STAGES[1].camera.y,
    z: STAGES[1].camera.z,
    lookX: STAGES[1].lookAt.x,
    lookY: STAGES[1].lookAt.y,
    lookZ: STAGES[1].lookAt.z,
    duration: 0.12,
    ease: 'power2.inOut'
  }, 0.18)

  tl.to(cameraState, {
    x: STAGES[2].camera.x,
    y: STAGES[2].camera.y,
    z: STAGES[2].camera.z,
    lookX: STAGES[2].lookAt.x,
    lookY: STAGES[2].lookAt.y,
    lookZ: STAGES[2].lookAt.z,
    duration: 0.12,
    ease: 'power2.inOut'
  }, 0.38)

  tl.to(cameraState, {
    x: STAGES[3].camera.x,
    y: STAGES[3].camera.y,
    z: STAGES[3].camera.z,
    lookX: STAGES[3].lookAt.x,
    lookY: STAGES[3].lookAt.y,
    lookZ: STAGES[3].lookAt.z,
    duration: 0.12,
    ease: 'power2.inOut'
  }, 0.58)

  tl.to(cameraState, {
    x: STAGES[0].camera.x,
    y: STAGES[0].camera.y,
    z: STAGES[0].camera.z,
    lookX: STAGES[0].lookAt.x,
    lookY: STAGES[0].lookAt.y,
    lookZ: STAGES[0].lookAt.z,
    duration: 0.18,
    ease: 'power2.inOut'
  }, 0.80)

  tl.to({}, { duration: 0.02 }, 0.98)

  return tl
}

export function disposeThreeScene(scene: THREE.Scene): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
      child.geometry?.dispose()
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => m?.dispose())
    }
  })
}
