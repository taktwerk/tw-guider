import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { File } from '@ionic-native/file/ngx';
import { AfterViewInit } from '@angular/core';
import { NgZone } from '@angular/core';

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
export class Viewer3dModelComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @Input() fileName: string;
    @Input() backgroundColor = 'green';
    @Input() madeUserIteractions = true;

    @ViewChild('domObj', {static: false}) domObj: ElementRef;

    isInit = false;
    resizeCanvas = false;
    isRotateModel = true;
    stopRender = false;

    modelElement: any;
    camera: any;
    scene: any;
    renderer: any;
    gltf: any;
    pivot: any;
    requestAnimationFrameId: number;

    constructor(
        private file: File,
        private ngZone: NgZone,
        private elementRef: ElementRef
    ) {}

    async init() {
        if (this.requestAnimationFrameId) {
            return;
        }
        this.modelElement = this.domObj.nativeElement;
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

        if (this.madeUserIteractions) {
            let controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.addEventListener('change', () => {
                this.render();
            });
            controls.addEventListener('click', () => {
                console.log('pidrilllla');
            });
        }

        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();

        const loader = new GLTFLoader();
        this.isInit = true;
        if (!this.gltf) {
            const fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1, this.fileName.length);
            const path = this.fileName.slice(0, (fileName.length) * -1);
            const bufferData = await this.file.readAsText(path, fileName);
            loader.parse(bufferData, '', (gltf) => {
                    console.log('parse data');
                    this.gltf = gltf;
                    this.renderModel();
                },
                (error) => {
                    console.log('gltfError', error);
                }
            );
        } else {
            this.renderModel();
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
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
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.animate();
        });
        console.log('request animation');

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
        this.ngZone.runOutsideAngular(() => {
            this.animate();
        });
        window.dispatchEvent(new Event('resize'));

        console.log('this.modelElementthis.modelElementthis.modelElement', this.modelElement);
        this.modelElement
            .addEventListener('click', () => {
                console.log('clicked on canvas')
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

    pauseRender() {
        console.log('pause render');
        this.stopRender = true;
    }

  cancelRender() {
        console.log('cancel render');
        if (this.requestAnimationFrameId) {
          cancelAnimationFrame(this.requestAnimationFrameId);
        }
  }

  ngAfterViewInit() {
      const el = this.elementRef.nativeElement.querySelector('.three-model canvas');
      if (el) {
          el.addEventListener('click', () => {
              console.log('kozliiiiiina');
          });
      }

  }

  ngAfterViewChecked()
  {
      if (!this.isInit) {
          this.ngZone.runOutsideAngular(() => {
              this.init();
          });
      }
  }

    ngOnDestroy() {
      console.log('ngDestroy');
      this.stopRender = true;
      if (this.requestAnimationFrameId) {
          cancelAnimationFrame(this.requestAnimationFrameId);
      }
  }

    ionViewDidLeave() {
        console.log('ionViewDidLeave');
        this.stopRender = true;
        if (this.requestAnimationFrameId) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
    }
}
