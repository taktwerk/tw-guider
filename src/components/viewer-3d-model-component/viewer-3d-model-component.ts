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
import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter";
import * as skeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { File } from '@ionic-native/file/ngx';
import { AfterViewInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { createGesture, Gesture, GestureDetail } from '@ionic/core';
import { Storage } from '@ionic/storage';
import {Viewer3dService} from "../../services/viewer-3d-service";

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 const { Filesystem } = Plugins;

@Component({
  selector: 'viewer-3d-model-component',
  styleUrls: ['viewer-3d-model-component.scss'],
  templateUrl: 'viewer-3d-model-component.html',
})
export class Viewer3dModelComponent implements AfterViewChecked, OnDestroy {
    @Input() fileName: string;
    @Input() backgroundColor = 'green';
    @Input() madeUserIteractions = true;
    @Input() willStopRotate = true;
    @Input() fullScreen = true;

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

    /// new
    ctx: any;
    /// new

    constructor(
        private file: File,
        private ngZone: NgZone,
        private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
        private storage: Storage,
        private viewer3d: Viewer3dService
    ) {}

    async init() {
        console.log('init 3d model viewer');
        if (this.isInit) {
            return;
        }
        if (this.requestAnimationFrameId) {
            return;
        }
        if (!this.domObj.nativeElement) {
            return;
        }
        this.modelElement = this.domObj.nativeElement;
        if (!this.modelElement.clientWidth || !this.modelElement.clientHeight) {
            return;
        }
        this.isInit = true;

        ///new
        this.ctx = document.createElement('canvas').getContext('2d');
        this.modelElement.appendChild(this.ctx.canvas);
        ///new

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
        }

        const loader = new GLTFLoader();
        const fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1, this.fileName.length);
        const path = this.fileName.slice(0, (fileName.length) * -1);
        let bufferData = null;
        try {
            const modelFile = await Filesystem.readFile({ path: path + fileName });
            var binary_string = window.atob(modelFile.data);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            bufferData = bytes.buffer;
            // bufferData = await this.file.readAsArrayBuffer(path, fileName);
            // console.log('bufferDatabufferData', bufferData);
        } catch (error) {
            console.log('3d model file error', error);
        }
        
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
        const {left, right, top, bottom, width, height} = this.modelElement.getBoundingClientRect();
        if (this.resizeCanvas) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( this.modelElement.width, this.modelElement.height, false );
        }

        /// new
         const isOffscreen =
            bottom < 0 ||
            top > window.innerHeight ||
            right < 0 ||
            left > window.innerWidth;
        /// new

        if (isOffscreen) { 
          this.requestAnimationFrameId = requestAnimationFrame(() => {
              this.animate();
          });
          return;
        }

        const rendererCanvas = this.renderer.domElement;
        this.renderer.setSize(width, height, false);
        // if (rendererCanvas.width < width || rendererCanvas.height < height) {
        //   this.renderer.setSize(width, height, false);
        // }
        // make sure the canvas for this area is the same size as the area
        if (this.ctx.canvas.width !== width || this.ctx.canvas.height !== height) {
          this.ctx.canvas.width = width;
          this.ctx.canvas.height = height;
        }

        // const positiveYUpBottom = this.renderer.domElement.clientHeight - bottom;
        this.renderer.setScissor(0, 0, width, height);
        this.renderer.setViewport(0, 0, width, height);

        if (this.isRotateModel) {
            this.pivot.rotation.y += 0.01;
        }

        // this.camera.aspect = width / height;
        // this.camera.updateProjectionMatrix();
        // this.controls.handleResize();
        // this.controls.update();

        
        // this.renderer.setScissor(left, positiveYUpBottom, width, height);
        // this.renderer.setViewport(left, positiveYUpBottom, width, height);
        // this.controls.handleResize();
        // this.controls.update();
        this.render();

        /// new
        this.ctx.globalCompositeOperation = 'copy';
        this.ctx.drawImage(
            rendererCanvas, //img
            0, // dx
            0, //dy
            width, //dWidth
            height //dHeight
        );                              // dst rect
        /// new
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.animate();
        });        
    }

    renderModel() {
        this.renderer = this.viewer3d.getGlobalRenderer();
        const object: any = this.gltfScene;
        this.pivot = new THREE.Group();
        const light1  = new THREE.AmbientLight(0xffffff, 3);
        const light2  = new THREE.DirectionalLight(0xffffff, 4);
        light2.position.set(0.5, 0, 0.866); // ~60º
        this.pivot.add( object );
        this.scene = new THREE.Scene();
        this.scene.add(light1);
        this.scene.add(light2);
        this.scene.add(this.pivot);
        if (this.backgroundColor) {
            this.scene.background = new THREE.Color(this.backgroundColor);
        }
        const box = new THREE.Box3().setFromObject( object );
        const center = box.getCenter( object.position );
        
        // object.position.x += (object.position.x - center.x);
        // object.position.y += (object.position.y - center.y);
        // object.position.z += (object.position.z - center.z);

        const {left, right, top, bottom, width, height} = this.modelElement.getBoundingClientRect();
        const areaWidth = width;
        const areaHeight = height;

        const size = box.getSize(new THREE.Vector3()).length();

        console.log('width', width);
        console.log('height', height)

        this.camera = new THREE.PerspectiveCamera(
                    50,
                    width/height,
                    size / 100,
                    size * 100
                );
        // this.camera.position.copy(center);
        this.camera.position.x += size;
        this.camera.position.y += size / 5.0;
        this.camera.position.z = (2 + size / 2.0);
        this.camera.lookAt(center);
        

        // this.pivot.add(this.camera);
        // this.camera.lookAt( this.pivot.position );

        this.scene.add(this.camera);

        object.position.multiplyScalar( - 1 );

        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, this.modelElement);
        this.controls.enableRotate = this.madeUserIteractions;
        this.controls.enablePan = false;
        
        this.ngZone.runOutsideAngular(() => {
            this.animate();
        });
        window.onresize = () => {
            setTimeout(() => {
                if (!this.modelElement.clientWidth || !this.modelElement.clientHeight) {
                    return;
                }
                if (this.renderer.domElement.width !== window.innerWidth ||
                    this.renderer.domElement.height !== window.innerHeight
                ) {
                    this.resizeCanvas = true;
                }
            })
        };
        const gesture = createGesture({
            // el: this.renderer.domElement,
            el: this.ctx.canvas,
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
