import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'
const isMobile1 = typeof window !== 'undefined' && window.innerWidth < 768
const WIDTH = isMobile1 ? 28 : 14
const DIAMONDS = WIDTH * WIDTH
const BOUNDS = 800

const fragmentShaderPosition = `
    uniform float delta;
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 tmpPos = texture2D( texturePosition, uv );
      vec3 position = tmpPos.xyz;
      vec3 velocity = texture2D( textureVelocity, uv ).xyz;
      float phase = tmpPos.w;
      // Fase dita a velocidade do giro do diamante
      phase = mod( ( phase + delta + length( velocity.xz ) * delta * 3.0 ), 62.83 );
      gl_FragColor = vec4( position + velocity * delta * 15. , phase );
    }
  `

const fragmentShaderVelocity = `
    uniform float time;
    uniform float delta;
    uniform float separationDistance;
    uniform vec3 predator;

    const float width = resolution.x;
    const float height = resolution.y;
    const float UPPER_BOUNDS = ${BOUNDS.toFixed(2)};
    
    const float SPEED_LIMIT = 2.5; 

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
      vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;

      vec3 velocity = selfVelocity;
      float limit = SPEED_LIMIT;

      // 1. FUGIR DO MOUSE (Predador)
      vec3 predatorPos = predator * (UPPER_BOUNDS * 0.5); 
      predatorPos.z = 0.0;
      
      vec3 dirToPredator = predatorPos - selfPosition;
      dirToPredator.z = 0.0;
      float distToPredator = length(dirToPredator);
      float preyRadius = 250.0; // Distância do susto

      if (distToPredator < preyRadius && distToPredator > 0.0) {
        // Empurra para longe do mouse proporcionalmente à proximidade
        float force = (1.0 - (distToPredator / preyRadius)) * delta * 200.0;
        velocity -= normalize(dirToPredator) * force;
        limit += 5.0; // Acelera o diamante na fuga
      }

      // 2. CAIXA DE CONTENÇÃO (Mantém eles sempre visíveis na tela)
      float edgeX = 600.0; // Limite horizontal
      float edgeY = 350.0; // Limite vertical
      float edgeZ = 150.0; // Profundidade 3D
      
      if (selfPosition.x > edgeX) velocity.x -= (selfPosition.x - edgeX) * delta * 0.5;
      if (selfPosition.x < -edgeX) velocity.x += (-selfPosition.x - edgeX) * delta * 0.5;
      
      if (selfPosition.y > edgeY) velocity.y -= (selfPosition.y - edgeY) * delta * 0.5;
      if (selfPosition.y < -edgeY) velocity.y += (-selfPosition.y - edgeY) * delta * 0.5;

      if (selfPosition.z > edgeZ) velocity.z -= (selfPosition.z - edgeZ) * delta * 0.5;
      if (selfPosition.z < -edgeZ) velocity.z += (-selfPosition.z - edgeZ) * delta * 0.5;

      // 3. FLUTUAÇÃO ORGÂNICA (Evita que parem de se mover se ninguém mexer no mouse)
      velocity.x += sin(time * 0.5 + uv.x * 100.0) * delta * 1.5;
      velocity.y += cos(time * 0.6 + uv.y * 100.0) * delta * 1.5;
      velocity.z += sin(time * 0.7 + (uv.x + uv.y) * 100.0) * delta * 1.5;

      // 4. SEPARAÇÃO TOTAL (Eles se empurram, garantindo preenchimento igual de toda a tela!)
      float zoneRadiusSquared = separationDistance * separationDistance;
      for ( float y = 0.0; y < height; y++ ) {
        for ( float x = 0.0; x < width; x++ ) {
          vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
          vec3 otherPosition = texture2D( texturePosition, ref ).xyz;
          
          vec3 diff = selfPosition - otherPosition;
          float dist = length( diff );

          if ( dist > 0.0001 && dist < separationDistance ) {
            float force = (1.0 - (dist / separationDistance)) * delta * 10.0;
            velocity += normalize(diff) * force;
          }
        }
      }

      // 5. LIMITES E ATRITO
      if ( length( velocity ) > limit ) {
        velocity = normalize( velocity ) * limit;
      }
      
      // Suaviza o movimento ao longo do tempo
      velocity *= 0.98;

      gl_FragColor = vec4( velocity, 1.0 );
    }
  `

const diamondVS = `
    attribute vec2 reference;
    attribute vec3 diamondColor;
    attribute float facetSeed;

    uniform sampler2D texturePosition;
    uniform sampler2D textureVelocity;
    uniform float uTime;

    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vFacetSeed;
    varying float z;

    void main() {
      vec4 tmpPos = texture2D( texturePosition, reference );
      vec3 pos = tmpPos.xyz;
      vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);
      vec3 newPosition = position;

      newPosition = mat3( modelMatrix ) * newPosition;

      float diamondSeed = fract( sin( dot( reference, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

      float spinAngle = uTime * ( 0.6 + diamondSeed * 0.6 ) + diamondSeed * 6.28318;
      float wobbleAngle = sin( uTime * 0.5 + diamondSeed * 6.28318 ) * 0.12;

      mat3 matSpin = mat3(
        cos( spinAngle ), 0.0, sin( spinAngle ),
        0.0, 1.0, 0.0,
        -sin( spinAngle ), 0.0, cos( spinAngle )
      );

      mat3 matWobble = mat3(
        1.0, 0.0, 0.0,
        0.0, cos( wobbleAngle ), -sin( wobbleAngle ),
        0.0, sin( wobbleAngle ), cos( wobbleAngle )
      );

      newPosition = matWobble * matSpin * newPosition;
      vec3 spunNormal = matWobble * matSpin * normal;

      velocity.z *= -1.;
      float xz = length( velocity.xz );
      float x = sqrt( 1. - velocity.y * velocity.y );

      float cosry = velocity.x / xz;
      float sinry = velocity.z / xz;
      float cosrz = x;
      float sinrz = velocity.y;

      mat3 maty = mat3( cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry );
      mat3 matz = mat3( cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1 );

      newPosition = maty * matz * newPosition;

      vNormal = normalMatrix * (maty * matz * spunNormal);
      newPosition += pos;

      vec4 mvPosition = viewMatrix * vec4( newPosition, 1.0 );
      vViewDir = normalize( -mvPosition.xyz );

      z = newPosition.z;
      vColor = vec4( diamondColor, 1.0 );
      vFacetSeed = facetSeed;
      gl_Position = projectionMatrix * mvPosition;
    }
  `

const diamondFS = `
    varying vec4 vColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vFacetSeed;
    varying float z;

    uniform vec3 uPrimaryColor;
    uniform float uTime;

    void main() {
      vec3 normal = normalize( vNormal );
      vec3 viewDir = normalize( vViewDir );
      vec3 lightDir = normalize( vec3( 0.5, 1.0, 0.8 ) );

      float diffuse = max( dot( normal, lightDir ), 0.2 );

      vec3 halfDir = normalize( lightDir + viewDir );
      float specular = pow( max( dot( normal, halfDir ), 0.0 ), 50.0 );

      float fresnel = pow( 1.0 - max( dot( normal, viewDir ), 0.0 ), 3.0 );
      float sparkle = pow( max( sin( uTime * 3.0 + vFacetSeed * 62.83 ), 0.0 ), 14.0 );

      float zFactor = 0.4 + ( 1000. - z ) / 1000. * 0.6;

      vec3 base = uPrimaryColor * diffuse * zFactor;
      vec3 highlight = vec3( 1.0 ) * ( specular * 1.2 + sparkle * 1.6 );
      vec3 finalColor = base + highlight + uPrimaryColor * fresnel * 0.8;

      float alpha = clamp( 0.22 + fresnel * 0.55 + specular * 0.5 + sparkle * 0.6, 0.0, 1.0 );

      gl_FragColor = vec4( finalColor, alpha );
    }
  `

const FACETS = 6
const TRIANGLES_PER_DIAMOND = FACETS + FACETS * 2 + FACETS

class DiamondGeometry extends THREE.BufferGeometry {
  constructor() {
    super()
    const triangles = DIAMONDS * TRIANGLES_PER_DIAMOND
    const points = triangles * 3

    const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
    const normals = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
    const diamondColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3)
    const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2)
    const facetSeed = new THREE.BufferAttribute(new Float32Array(points), 1)

    this.setAttribute('position', vertices)
    this.setAttribute('normal', normals)
    this.setAttribute('diamondColor', diamondColors)
    this.setAttribute('reference', references)
    this.setAttribute('facetSeed', facetSeed)

    let v = 0
    const vertsPush = (...args: number[]) => {
      for (let i = 0; i < args.length; i++) vertices.array[v++] = args[i]
    }

    const R = 10
    const TABLE_R = 4.5
    const CROWN_H = 6
    const PAVILION_H = 16

    const girdle: [number, number][] = []
    const table: [number, number][] = []
    for (let i = 0; i < FACETS; i++) {
      const angle = (i / FACETS) * Math.PI * 2
      girdle.push([Math.cos(angle) * R, Math.sin(angle) * R])
      table.push([Math.cos(angle) * TABLE_R, Math.sin(angle) * TABLE_R])
    }

    for (let f = 0; f < DIAMONDS; f++) {
      for (let i = 0; i < FACETS; i++) {
        const [tx0, tz0] = table[i]
        const [tx1, tz1] = table[(i + 1) % FACETS]
        vertsPush(0, CROWN_H, 0, tx1, CROWN_H, tz1, tx0, CROWN_H, tz0)
      }

      for (let i = 0; i < FACETS; i++) {
        const [tx0, tz0] = table[i]
        const [tx1, tz1] = table[(i + 1) % FACETS]
        const [gx0, gz0] = girdle[i]
        const [gx1, gz1] = girdle[(i + 1) % FACETS]
        vertsPush(tx0, CROWN_H, tz0, gx1, 0, gz1, gx0, 0, gz0)
        vertsPush(tx0, CROWN_H, tz0, tx1, CROWN_H, tz1, gx1, 0, gz1)
      }

      for (let i = 0; i < FACETS; i++) {
        const [gx0, gz0] = girdle[i]
        const [gx1, gz1] = girdle[(i + 1) % FACETS]
        vertsPush(0, -PAVILION_H, 0, gx0, 0, gz0, gx1, 0, gz1)
      }
    }

    for (let i = 0; i < triangles * 3; i++) {
      const diamondIndex = Math.floor(i / (TRIANGLES_PER_DIAMOND * 3))
      const x = (diamondIndex % WIDTH) / WIDTH
      const y = Math.floor(diamondIndex / WIDTH) / WIDTH

      diamondColors.array[i * 3 + 0] = 1.0
      diamondColors.array[i * 3 + 1] = 1.0
      diamondColors.array[i * 3 + 2] = 1.0
      references.array[i * 2] = x
      references.array[i * 2 + 1] = y

      const facetIndex = Math.floor(i / 3) % TRIANGLES_PER_DIAMOND
      facetSeed.array[i] = Math.abs(Math.sin(diamondIndex * 12.9898 + facetIndex * 78.233)) % 1
    }

    this.computeVertexNormals()

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const scaleSize = isMobile ? 0.40 : 0.26
    this.scale(scaleSize, scaleSize, scaleSize)
  }
}

function DiamondsScene() {
  const { gl, size } = useThree()
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const { gpuCompute, positionVariable, velocityVariable } = useMemo(() => {
    const gpu = new GPUComputationRenderer(WIDTH, WIDTH, gl)

    const dtPosition = gpu.createTexture()
    const dtVelocity = gpu.createTexture()

    const posArray = dtPosition.image.data
    const velArray = dtVelocity.image.data

    if (posArray) {
      for (let k = 0; k < posArray.length; k += 4) {
        posArray[k + 0] = (Math.random() - 0.5) * 1200
        posArray[k + 1] = (Math.random() - 0.5) * 700
        posArray[k + 2] = (Math.random() - 0.5) * 300
        posArray[k + 3] = 1
      }
    }

    if (velArray) {
      for (let k = 0; k < velArray.length; k += 4) {
        velArray[k + 0] = (Math.random() - 0.5) * 4
        velArray[k + 1] = (Math.random() - 0.5) * 4
        velArray[k + 2] = (Math.random() - 0.5) * 4
        velArray[k + 3] = 1
      }
    }

    const velVar = gpu.addVariable('textureVelocity', fragmentShaderVelocity, dtVelocity)
    const posVar = gpu.addVariable('texturePosition', fragmentShaderPosition, dtPosition)

    gpu.setVariableDependencies(velVar, [posVar, velVar])
    gpu.setVariableDependencies(posVar, [posVar, velVar])

    velVar.material.uniforms['delta'] = { value: 0.0 }
    velVar.material.uniforms['time'] = { value: 0.0 }
    velVar.material.uniforms['separationDistance'] = { value: 140.0 }
    velVar.material.uniforms['predator'] = { value: new THREE.Vector3() }

    posVar.material.uniforms['delta'] = { value: 0.0 }

    velVar.wrapS = THREE.RepeatWrapping
    velVar.wrapT = THREE.RepeatWrapping
    posVar.wrapS = THREE.RepeatWrapping
    posVar.wrapT = THREE.RepeatWrapping

    gpu.init()
    return { gpuCompute: gpu, positionVariable: posVar, velocityVariable: velVar }
  }, [gl])

  const uniforms = useMemo(
    () => ({
      texturePosition: { value: null },
      textureVelocity: { value: null },
      uPrimaryColor: { value: new THREE.Color('#be123c') },
      uTime: { value: 0 },
    }),
    []
  )

  const geometry = useMemo(() => new DiamondGeometry(), [])

  useEffect(() => {
    const updatePrimaryColor = () => {
      const tempEl = document.createElement('div')
      tempEl.style.color = 'var(--primary)'
      tempEl.style.position = 'absolute'
      tempEl.style.pointerEvents = 'none'
      tempEl.style.opacity = '0'
      document.body.appendChild(tempEl)

      const computedColor = getComputedStyle(tempEl).color
      document.body.removeChild(tempEl)

      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      if (ctx) {
        ctx.fillStyle = computedColor
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

        if (materialRef.current) {
          materialRef.current.uniforms.uPrimaryColor.value.setRGB(r / 255, g / 255, b / 255)
          materialRef.current.needsUpdate = true
        }
      }
    }

    updatePrimaryColor()

    const observer = new MutationObserver(updatePrimaryColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    return () => observer.disconnect()
  }, [])

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 1.0)

    positionVariable.material.uniforms['delta'].value = safeDelta
    velocityVariable.material.uniforms['delta'].value = safeDelta

    velocityVariable.material.uniforms['time'].value = state.clock.elapsedTime

    const predator = velocityVariable.material.uniforms['predator'].value
    predator.set(
      (state.pointer.x * size.width) / 2 / (size.width / 2),
      (state.pointer.y * size.height) / 2 / (size.height / 2),
      0
    )

    gpuCompute.compute()

    if (materialRef.current) {
      materialRef.current.uniforms['texturePosition'].value =
        gpuCompute.getCurrentRenderTarget(positionVariable).texture
      materialRef.current.uniforms['textureVelocity'].value =
        gpuCompute.getCurrentRenderTarget(velocityVariable).texture
      materialRef.current.uniforms['uTime'].value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation-y={Math.PI / 2} matrixAutoUpdate={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={diamondVS}
        fragmentShader={diamondFS}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export const Particles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-stripes-custom0 transition-colors duration-500 -z-10">
      <Canvas
        camera={{ position: [0, 0, 350], fov: 75, near: 1, far: 3000 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 300, 100]} intensity={1.2} />
        <DiamondsScene />
      </Canvas>
    </div>
  )
}

export default Particles

