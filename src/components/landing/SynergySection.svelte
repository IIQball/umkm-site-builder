<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { MODEL_PATH, STAGES, BEFORE_STAGE } from './synergy.data'
  import SynergyOverlay from './SynergyOverlay.svelte'

  let containerElement: HTMLElement
  let canvasElement: HTMLCanvasElement
  let activeStage = 0
  let isLoaded = false

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let animId = 0
  let tl: gsap.core.Timeline | null = null
  let observer: IntersectionObserver | null = null

  const pinNodes: Record<string, THREE.Object3D | null> = {
    Pin_Kopi: null,
    Pin_Batik: null,
    Pin_Anyaman: null
  }

  const cameraState = {
    x: BEFORE_STAGE.camera.x,
    y: BEFORE_STAGE.camera.y,
    z: BEFORE_STAGE.camera.z,
    lookX: BEFORE_STAGE.lookAt.x,
    lookY: BEFORE_STAGE.lookAt.y,
    lookZ: BEFORE_STAGE.lookAt.z
  }

  let mouseX = 0
  let mouseY = 0
  let targetMouseX = 0
  let targetMouseY = 0

  function handleMouseMove(e: MouseEvent) {
    const halfW = window.innerWidth / 2
    const halfH = window.innerHeight / 2
    targetMouseX = (e.clientX - halfW) / halfW
    targetMouseY = (e.clientY - halfH) / halfH
  }

  function handleMouseLeave() {
    targetMouseX = 0
    targetMouseY = 0
  }

  function handleResize() {
    if (!containerElement || !renderer || !camera) return
    const width = containerElement.clientWidth
    const height = containerElement.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)

    const width = containerElement.clientWidth || window.innerWidth
    const height = containerElement.clientHeight || window.innerHeight

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 100)
    camera.position.set(cameraState.x, cameraState.y, cameraState.z)
    camera.lookAt(cameraState.lookX, cameraState.lookY, cameraState.lookZ)

    renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 3.5)
    rimLight.position.set(-0.05, 0.05, 0.04)
    scene.add(rimLight)

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.0)
    frontLight.position.set(0.05, -0.05, 0.06)
    scene.add(frontLight)

    const loader = new GLTFLoader()
    loader.load(
      MODEL_PATH,
      (gltf) => {
        if (!scene) return
        scene.add(gltf.scene)

        gltf.scene.traverse((child) => {
          if (child.name === 'Banyuwangi_Map' && child instanceof THREE.Mesh) {
            const mat = Array.isArray(child.material) ? child.material[0] : child.material
            if (mat && 'color' in mat) {
              mat.color.setHex(0x16181d)
              mat.roughness = 0.4
              mat.metalness = 0.3
              mat.needsUpdate = true
            }

            const edgesGeom = new THREE.EdgesGeometry(child.geometry, 25)
            const edgeMat = new THREE.LineBasicMaterial({
              color: 0xFC018B,
              transparent: true,
              opacity: 0.65
            })
            const edgeLines = new THREE.LineSegments(edgesGeom, edgeMat)
            edgeLines.position.y += 0.00005
            child.add(edgeLines)
          }
        })

        const pinNames = ['Pin_Kopi', 'Pin_Batik', 'Pin_Anyaman']
        pinNames.forEach((name) => {
          const pin = gltf.scene.getObjectByName(name)
          if (pin) {
            pinNodes[name] = pin
            pin.scale.set(0.65, 0.65, 0.65)
            const pinLight = new THREE.PointLight(0xFC018B, 2.0, 0.03)
            pinLight.position.set(0, 0.004, 0)
            pin.add(pinLight)
          }
        })

        isLoaded = true
        handleResize()
        ScrollTrigger.refresh()
      },
      undefined,
      (err) => {
        console.error('Failed to load 3D model', err)
      }
    )

    tl = gsap.timeline({
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
            activeStage = 0
          } else if (p < 0.40) {
            activeStage = 1
          } else if (p < 0.60) {
            activeStage = 2
          } else {
            activeStage = 3
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

    // Putar kembali kamera ke posisi P0 saat scroll menuju Value Matrix (konten tetap P3)
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

    const clock = new THREE.Clock()

    let isVisible = true

    if (typeof IntersectionObserver !== 'undefined' && containerElement) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting
        },
        { rootMargin: '400px 0px' }
      )
      observer.observe(containerElement)
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      if (!isVisible || !renderer || !scene || !camera) return

      const elapsed = clock.getElapsedTime()

      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      const floatY = Math.sin(elapsed * 1.6) * 0.0004
      const floatX = Math.cos(elapsed * 1.2) * 0.0003

      const offsetX = mouseX * 0.0032 + floatX
      const offsetY = mouseY * 0.0022 + floatY

      camera.position.set(
        cameraState.x + offsetX,
        cameraState.y - offsetY,
        cameraState.z
      )
      camera.lookAt(
        cameraState.lookX + offsetX * 0.25,
        cameraState.lookY - offsetY * 0.25,
        cameraState.lookZ
      )

      const activePinName = STAGES[activeStage]?.targetPin

      for (const [name, pin] of Object.entries(pinNodes)) {
        if (!pin) continue
        const isActive = activeStage === 0 || name === activePinName
        const pulseBase = activeStage === 0 ? 0.72 : 0.82
        const pulseSpeed = activeStage === 0 ? 3 : 4
        const targetScale = isActive ? pulseBase + Math.sin(elapsed * pulseSpeed) * 0.04 : 0.65
        const currentScale = pin.scale.x
        const nextScale = currentScale + (targetScale - currentScale) * 0.1
        pin.scale.set(nextScale, nextScale, nextScale)
      }

      renderer.render(scene, camera)
    }

    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }

    if (animId) {
      cancelAnimationFrame(animId)
    }

    if (tl) {
      tl.scrollTrigger?.kill()
      tl.kill()
    }

    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
          child.geometry?.dispose()
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((m) => m?.dispose())
        }
      })
    }

    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
    }
  })
</script>

<section
  id="synergy"
  bind:this={containerElement}
  class="relative overflow-hidden w-full h-[100dvh] min-h-[100dvh] bg-base-100 text-base-content transition-colors duration-300 select-none"
>
  <canvas
    bind:this={canvasElement}
    class="absolute inset-0 z-0 w-full h-full block transition-opacity duration-700 pointer-events-none {isLoaded ? 'opacity-100' : 'opacity-0'}"
  ></canvas>

  {#if !isLoaded}
    <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
      <div class="flex items-center gap-2.5 px-4 py-2 rounded-full bg-base-200/90 border border-base-content/10 shadow-lg backdrop-blur-md">
        <span class="loading loading-spinner loading-xs text-primary"></span>
        <span class="label-caps text-base-content/80 tracking-wider">Memuat Model 3D Peta...</span>
      </div>
    </div>
  {/if}

  <SynergyOverlay {activeStage} />
</section>
