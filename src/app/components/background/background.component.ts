import { Component, AfterViewInit, HostListener } from '@angular/core';
import * as THREE from 'three';
@Component({
    selector: 'background',
    standalone: true,
    imports: [],
    templateUrl: './background.component.html',
    styleUrl: './background.component.scss'
})
export class BackgroundComponent implements AfterViewInit {
    private scene!: THREE.Scene;
    private camera!: THREE.OrthographicCamera;
    private renderer!: THREE.WebGLRenderer;
    private points!: THREE.Points;
    private material!: THREE.ShaderMaterial;
    private backgroundQuad!: THREE.Mesh;
    private backgroundMaterial!: THREE.ShaderMaterial;
    private width: number;
    private height: number;
    private mouseX: number = 0;
    private mouseY: number = 0;

    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    ngAfterViewInit(): void {
        this.initThree();
        this.createBackground();
        this.createPoints();
        this.animate();
    }

    private initThree(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(0, this.width, this.height, 0, -1, 1);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        document.getElementById('background')?.appendChild(this.renderer.domElement);
    }

    private createBackground(): void {
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2(this.width, this.height) },
                mousePos: { value: new THREE.Vector2(0.5, 0.5) },
                radius: { value: 600.0 },
                colors: {
                    value: [
                        new THREE.Vector3(0x0E / 255, 0x0F / 255, 0x10 / 255), // outer
                        // new THREE.Vector3(0x0E / 255, 0x14 / 255, 0x1F / 255),
                        new THREE.Vector3(0x0E / 255, 0x14 / 255, 0x1F / 255),
                        new THREE.Vector3(0x11 / 255, 0x1B / 255, 0x2E / 255),
                        // new THREE.Vector3(0x11 / 255, 0x1B / 255, 0x2E / 255),
                        new THREE.Vector3(0x0E / 255, 0x1B / 255, 0x32 / 255)  // inner
                    ]
                }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec2 resolution;
                uniform vec2 mousePos;
                uniform float radius;
                uniform vec3 colors[4];
                varying vec2 vUv;
                void main() {
                    vec2 screenPos = vUv * resolution;
                    vec2 mouseScreenPos = mousePos * resolution;
                    float dist_pixels = distance(screenPos, mouseScreenPos);
                    float t = clamp(dist_pixels / radius, 0.0, 1.0);
                    vec3 color;
                    if (t < 0.333) {
                        color = mix(colors[3], colors[2], t / 0.333);
                    } else if (t < 0.666) {
                        color = mix(colors[2], colors[1], (t - 0.333) / 0.333);
                    } else if (t < 1.0) {
                        color = mix(colors[1], colors[0], (t - 0.666) / 0.333);
                    } else {
                        color = colors[0];
                    }
                    gl_FragColor = vec4(color, 1.0);
                }
        `
        });
        this.backgroundMaterial = material;
        this.backgroundQuad = new THREE.Mesh(geometry, material);
        this.backgroundQuad.position.set(this.width / 2, this.height / 2, 0);
        this.scene.add(this.backgroundQuad);
    }

    private createPoints(): void {
        const spacing = 30;
        const range = 2000;
        const positions = [];
        for (let x = -range; x <= range; x += spacing) {
            for (let y = -range; y <= range; y += spacing) {
                positions.push(x, y, 0);
            }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const vertexShader = `
      uniform vec2 mousePos;
      uniform vec3 darkBlue;
      uniform vec3 lightBlue;
      uniform float sigma;
      varying vec3 vColor;
      void main() {
        vec2 pos = position.xy;
        float dist = distance(pos, mousePos);
        float intensity = exp(-dist * dist / (2.0 * sigma * sigma));
        vColor = mix(darkBlue, lightBlue, intensity);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 2.0;
      }
    `;

        const fragmentShader = `
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                mousePos: { value: new THREE.Vector2(0, 0) },
                darkBlue: { value: new THREE.Vector3(0.15, 0.15, 0.15) },
                lightBlue: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
                sigma: { value: 100.0 }
            },
            vertexShader,
            fragmentShader
        });

        this.points = new THREE.Points(geometry, this.material);
        this.scene.add(this.points);
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.material.uniforms['mousePos'].value.set(this.mouseX, this.height - this.mouseY);
        this.backgroundMaterial.uniforms['mousePos'].value.set(this.mouseX / this.width, 1.0 - (this.mouseY / this.height));
        this.renderer.render(this.scene, this.camera);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.right = this.width;
        this.camera.top = this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.backgroundQuad.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.backgroundQuad.position.set(this.width / 2, this.height / 2, 0);
        this.backgroundMaterial.uniforms['resolution'].value.set(this.width, this.height);
    }
}
