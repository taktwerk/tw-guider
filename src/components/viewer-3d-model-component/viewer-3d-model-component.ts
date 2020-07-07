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
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";
import * as skeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { File } from '@ionic-native/file/ngx';
import { AfterViewInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { createGesture, Gesture, GestureDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';

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
export class Viewer3dModelComponent implements AfterViewChecked, OnDestroy {
    @Input() fileName: string;
    @Input() backgroundColor = 'green';
    @Input() madeUserIteractions = true;
    @Input() willStopRotate = true;

    @ViewChild('domObj', {static: false}) domObj: ElementRef;

    isInit = false;
    isRendered = false;
    resizeCanvas = false;
    isRotateModel = true;
    stopRender = false;

    modelElement: any;
    camera: any;
    scene: any;
    controls: any;
    renderer: any;
    gltfScene: any;
    pivot: any;
    requestAnimationFrameId: number;

    constructor(
        private file: File,
        private ngZone: NgZone,
        private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
        private storage: Storage
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
        if (this.isInit) {
            return;
        } else {
            this.isInit = true;
        }
        this.scene = new THREE.Scene();
        const areaWidth = this.modelElement.clientWidth;
        const areaHeight = this.modelElement.clientHeight;
        if (this.backgroundColor) {
            this.scene.background = new THREE.Color(this.backgroundColor);
        }
        this.camera = new THREE.PerspectiveCamera(50, areaWidth/areaHeight, 0.01, 1000);
        this.camera.aspect = areaWidth / areaHeight;
        this.camera.position.z = 2;

        const light1  = new THREE.AmbientLight(0xffffff, 3);
        this.scene.add( light1 );

        const light2  = new THREE.DirectionalLight(0xffffff, 4);
        light2.position.set(0.5, 0, 0.866); // ~60º
        this.scene.add( light2 );

        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(areaWidth, areaHeight);

        this.modelElement.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = this.madeUserIteractions;
        this.controls.addEventListener('change', () => {
            this.render();
        });

        await this.renderModels();
    }

    protected async renderModels() {
        let cachedSceneObject = null;

        THREE.Cache.enabled = true;
        cachedSceneObject = await THREE.Cache.get(this.fileName);
        THREE.Cache.enabled = false;

        if (cachedSceneObject) {
            this.gltfScene = skeletonUtils.SkeletonUtils.clone(cachedSceneObject);
            this.renderModel();
            return;
        }

        cachedSceneObject = await this.storage.get(this.fileName);

        if (cachedSceneObject) {
            const loaderSecond = new THREE.ObjectLoader();
            const scene: any = loaderSecond.parse(cachedSceneObject);
            this.gltfScene = scene;
            THREE.Cache.enabled = true;
            THREE.Cache.add(this.fileName, skeletonUtils.SkeletonUtils.clone(scene));
            THREE.Cache.enabled = false;
            this.renderModel();
            return;

            if (!scene) {
                return false;
            }
            const object = new THREE.Scene();
            object.uuid = scene.uuid;
            object.name = scene.name;
            object.background = ( scene.background !== null ) ? scene.background.clone() : null;
            if ( scene.fog !== null ) {
                object.fog = scene.fog.clone();
            }
            object.userData = JSON.parse(JSON.stringify(scene.userData));
            while ( scene.children.length > 0 ) {
                object.add(scene.children[0]);
            }
            this.gltfScene = object;
            THREE.Cache.enabled = true;
            THREE.Cache.add(this.fileName, skeletonUtils.SkeletonUtils.clone(object));
            THREE.Cache.enabled = false;
            this.renderModel();
            return;
        }

        const loader = new GLTFLoader();
        const fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1, this.fileName.length);
        const path = this.fileName.slice(0, (fileName.length) * -1);
        const bufferData = await this.file.readAsArrayBuffer(path, fileName);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/assets/threeJs/loaders/gltf/draco/' );
        dracoLoader.setDecoderConfig({type: 'js'});
        loader.setDRACOLoader( dracoLoader )
        loader.parse(bufferData, '', (gltf) => {
                this.gltfScene = gltf.scene;
                THREE.Cache.enabled = true;
                THREE.Cache.add(this.fileName, skeletonUtils.SkeletonUtils.clone(gltf.scene));
                THREE.Cache.enabled = false;
                const sceneSkeleton: any = skeletonUtils.SkeletonUtils.clone(gltf.scene);
                this.storage.set(this.fileName, sceneSkeleton.toJSON());

                this.renderModel();
            },
            (error) => {
                console.log('gltfError', error);
            }
        );
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
        const object: any = this.gltfScene;
        this.pivot = new THREE.Group();
        this.pivot.add( object );
        const box = new THREE.Box3().setFromObject( object );
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(object.position);

        this.controls.maxDistance = size * 10;
        this.controls.enabled = true;

        this.camera.near = size / 100;
        this.camera.far = size * 100;

        this.camera.position.x += size;
        this.camera.position.y += size / 5.0;
        this.camera.position.z += size / 2.0 ;
        this.camera.lookAt(center);

        this.camera.updateProjectionMatrix();

        object.position.multiplyScalar( - 1 );

        this.controls.update();
        this.scene.add( this.pivot );
        this.ngZone.runOutsideAngular(() => {
            this.animate();
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
        const gesture = createGesture({
            el: this.modelElement,
            gestureName: 'longpress',
            threshold: 0,
            canStart: () => true,
            onStart: (gestureEv: GestureDetail) => {
                if (this.willStopRotate && this.isRotateModel) {
                    this.isRotateModel = false;
                }
            },
            onEnd: () => {
                console.log('end my presss');
            }
        });
        gesture.setDisabled(false);

        window.dispatchEvent(new Event('resize'));
        this.isRendered = true;
        this.detectChanges();
    }

    pauseRender() {
        this.stopRender = true;
    }

  cancelRender() {
        if (this.requestAnimationFrameId) {
          cancelAnimationFrame(this.requestAnimationFrameId);
        }
  }

  stopAutoRotation() {
        if (this.isRotateModel) {
            this.isRotateModel = false;
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
      this.stopRender = true;
      if (this.requestAnimationFrameId) {
          cancelAnimationFrame(this.requestAnimationFrameId);
      }
  }

    detectChanges() {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }
}
