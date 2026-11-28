<script lang="ts">
  import { onMount } from 'svelte'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { MODEL_PATH, STAGES } from './synergy.data'
  import { setupSceneLights, disposeThreeScene } from './synergy3d.helpers'

  export let activeStage = 0
  export let onReady: () => void
  export let onFailure: () => void

  let canvasElement: HTMLCanvasElement
  let queueDraw: ((stage: number) => void) | undefined
  $: queueDraw?.(activeStage)

  onMount(() => {
    const controller = new AbortController()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.001, 100)
    let renderer: THREE.WebGLRenderer | undefined
    let sizeObserver: ResizeObserver | undefined
    let paint = 0

    const fail = () => {
      if (!controller.signal.aborted) onFailure()
    }

    function draw(stage: number) {
      if (!renderer) return
      const view = STAGES[stage]
      camera.position.set(view.camera.x, view.camera.y, view.camera.z)
      camera.lookAt(view.lookAt.x, view.lookAt.y, view.lookAt.z)
      renderer.render(scene, camera)
    }

    async function initialize() {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: true,
      })
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3
      renderer.outputColorSpace = THREE.SRGBColorSpace
      setupSceneLights(scene)

      const response = await fetch(MODEL_PATH, { signal: controller.signal })
      if (!response.ok) throw new Error('Peta 3D tidak tersedia')
      const { scene: model } = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '')
      if (controller.signal.aborted) {
        disposeThreeScene(model)
        return
      }
      scene.add(model)

      const terrain = model.getObjectByName('Banyuwangi_Map')
      if (terrain instanceof THREE.Mesh) {
        const material = Array.isArray(terrain.material) ? terrain.material[0] : terrain.material
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.setHex(0x16181d)
          material.roughness = 0.4
          material.metalness = 0.3
        }
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(terrain.geometry, 25),
          new THREE.LineBasicMaterial({ color: 0xfc018b, transparent: true, opacity: 0.65 }),
        )
        edges.position.y += 0.00005
        terrain.add(edges)
      }

      for (const { targetPin } of STAGES.slice(1)) {
        const pin = model.getObjectByName(targetPin)
        if (!pin) continue
        pin.scale.setScalar(0.72)
        const light = new THREE.PointLight(0xfc018b, 2, 0.03)
        light.position.y = 0.004
        pin.add(light)
      }

      function resize() {
        const { clientWidth, clientHeight } = canvasElement
        if (!clientWidth || !clientHeight || !renderer) return
        camera.aspect = clientWidth / clientHeight
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        renderer.setSize(clientWidth, clientHeight, false)
        draw(activeStage)
      }

      resize()
      queueDraw = (stage) => {
        cancelAnimationFrame(paint)
        paint = requestAnimationFrame(() => {
          try {
            draw(stage)
          } catch {
            fail()
          }
        })
      }
      sizeObserver = new ResizeObserver(() => {
        try {
          resize()
        } catch {
          fail()
        }
      })
      sizeObserver.observe(canvasElement)
      onReady()
    }

    canvasElement.addEventListener('webglcontextlost', fail)
    void initialize().catch(fail)

    return () => {
      controller.abort()
      sizeObserver?.disconnect()
      window.cancelAnimationFrame(paint)
      canvasElement.removeEventListener('webglcontextlost', fail)
      disposeThreeScene(scene)
      renderer?.dispose()
      renderer?.forceContextLoss()
    }
  })
</script>

<canvas bind:this={canvasElement} class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
