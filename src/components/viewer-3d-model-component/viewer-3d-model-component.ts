import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'viewer-3d-model-component',
  templateUrl: 'viewer-3d-model-component.html',
})
export class Viewer3dModelComponent implements OnInit {
    @Input() fileName: string;

    @ViewChild('domObj', {static: false}) canvasEl: ElementRef;

    resizeCanvas = false;
    isRotateModel = true;
    stopRender = false;
    backgroundColor = 'green';
    modelElement: any;
    camera: any;
    scene: any;
    renderer: any;
    gltf: any;
    pivot: any;

    constructor() {}

    async init() {
        this.modelElement = this.canvasEl.nativeElement;
        if (!this.modelElement) {
            return;
        }
        if (!this.modelElement.clientWidth || !this.modelElement.clientHeight) {
            return;
        }
        this.scene = new THREE.Scene();
        const areaWidth = this.modelElement.clientWidth;
        const areaHeight = this.modelElement.clientHeight;
        if (this.backgroundColor) {
            this.scene.background = new THREE.Color(this.backgroundColor);
        }
        this.camera = new THREE.PerspectiveCamera(75, areaWidth/areaHeight, 1, 500);
        this.camera.aspect = areaWidth / areaHeight;
        this.camera.position.z = 2;

        const hlight = new THREE.AmbientLight (0xFFFFFF,1);
        this.scene.add(hlight);

        const directionalLight = new THREE.DirectionalLight(0xffffff,1);
        directionalLight.position.set(1,1,1);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        const light = new THREE.PointLight(0xFFFFFF,3);
        light.position.set(1,1,1);
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
        this.renderer.setSize(areaWidth, areaHeight);

        this.modelElement.appendChild(this.renderer.domElement);

        let controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.addEventListener('change', this.renderer);
        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();

        const loader = new GLTFLoader();
        if (!this.gltf) {
            this.gltf = await loader.loadAsync(this.fileName);
        }

        this.renderModel();

        this.modelElement.nativeElement.querySelector('canvas')
            .addEventListener('mousedown', () => {
                this.isRotateModel = false;
            });

        window.onresize = () => {
            setTimeout(() => {
                if (!this.modelElement.clientWidth || !this.modelElement.clientHeight) {
                    return;
                }
                if (this.renderer.domElement.width !== this.modelElement.clientWidth ||
                    this.renderer.domElement.height !== this.modelElement.clientHeight
                ) {
                    this.resizeCanvas = true;
                }
            })
        };
    }

    animate() {
        if (this.stopRender) {
            return;
        }
        if (this.isRotateModel) {
            this.pivot.rotation.y += 0.01;
        }
        if (this.resizeCanvas) {
            this.camera.aspect = this.modelElement.clientWidth / this.modelElement.clientHeight;
            this.renderer.setSize( this.modelElement.clientWidth, this.modelElement.clientHeight );
            this.camera.updateProjectionMatrix();
        }
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    }

    renderModel() {
        const object = this.gltf.scene;
        const box = new THREE.Box3().setFromObject( object );
        box.getCenter( object.position );
        object.position.multiplyScalar( - 1 );

        this.pivot = new THREE.Group();
        this.scene.add( this.pivot );
        this.pivot.add( object );

        this.renderer.render(this.scene, this.camera);
        this.animate();
        window.dispatchEvent(new Event('resize'));
    }

  // detectChanges() {
  //   if (!this.changeDetectorRef['destroyed']) {
  //     this.changeDetectorRef.detectChanges();
  //   }
  // }

  ionViewDidEnter() {
      this.init();
   }

  ngOnInit() {
        ///
  }
}
