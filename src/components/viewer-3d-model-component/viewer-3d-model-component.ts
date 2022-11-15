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
import { Capacitor, Plugins } from '@capacitor/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { NgZone } from '@angular/core';
import { createGesture, GestureDetail } from '@ionic/core';
import { Storage } from '@ionic/storage-angular';

import { SkeletonUtils } from "./SkeletonUtils";
import { Viewer3dService } from 'src/app/library/services/viewer-3d-service';


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

    @ViewChild('domObj') domObj: ElementRef;

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
        private ngZone: NgZone,
        private changeDetectorRef: ChangeDetectorRef,
        private storage: Storage,
        private viewer3d: Viewer3dService,
        private skeletonUtils: SkeletonUtils
    ) { }

    async init() {
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
            this.gltfScene = this.skeletonUtils.clone(cachedSceneObject);
            this.renderModel();
            return;
        }

        cachedSceneObject = await this.storage.get(this.fileName);

        if (cachedSceneObject) {
            const loaderSecond = new THREE.ObjectLoader();
            const scene: any = loaderSecond.parse(cachedSceneObject);
            this.gltfScene = scene;
            THREE.Cache.enabled = true;
            THREE.Cache.add(this.fileName, this.skeletonUtils.clone(scene));
            THREE.Cache.enabled = false;
            this.renderModel();
            return;
        }

        const loader = new GLTFLoader();
        const fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1, this.fileName.length);
        const path = this.fileName.slice(0, (fileName.length) * -1);
        let bufferData = null;
        try {
            const path__fileName = path + fileName;
            if (path__fileName.split('.').pop() == "gltf") {
                console.log('pathfileName', (path + fileName));
                // read model from path
                const convertFileSrc = Capacitor.convertFileSrc(path + fileName);
                const response = await fetch(convertFileSrc);
                bufferData = await response.arrayBuffer();
            }
        } catch (error) {
            console.log('3d model file error', error);
        }

        if (bufferData != null) {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/assets/threeJs/loaders/gltf/draco/');
            dracoLoader.setDecoderConfig({ type: 'js' });
            loader.setDRACOLoader(dracoLoader);
            console.log(bufferData)
            loader.parse(bufferData, '',
                (gltf) => {
                    this.gltfScene = gltf.scene;
                    console.log(this.gltfScene)
                    THREE.Cache.enabled = true;
                    THREE.Cache.add(this.fileName, this.skeletonUtils.clone(gltf.scene));
                    THREE.Cache.enabled = false;
                    const sceneSkeleton: any = this.skeletonUtils.clone(gltf.scene);
                    this.storage.set(this.fileName, sceneSkeleton.toJSON());
                    this.renderModel();
                },
                (error) => {
                    console.log('gltfError', error);
                }
            );
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        if (this.stopRender) {
            return;
        }
        const { left, right, top, bottom, width, height } = this.modelElement.getBoundingClientRect();
        if (this.resizeCanvas) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.modelElement.width, this.modelElement.height, false);
        }

        /// new
        const isOffscreen =
            bottom < 0 ||
            top > window.innerHeight ||
            right < 0 ||
            left > window.innerWidth;

        if (isOffscreen) {
            this.requestAnimationFrameId = requestAnimationFrame(() => {
                this.animate();
            });
            return;
        }

        const rendererCanvas = this.renderer.domElement;
        this.renderer.setSize(width, height, false);
        if (this.ctx.canvas.width !== width || this.ctx.canvas.height !== height) {
            this.ctx.canvas.width = width;
            this.ctx.canvas.height = height;
        }
        this.renderer.setScissor(0, 0, width, height);
        this.renderer.setViewport(0, 0, width, height);

        if (this.isRotateModel) {
            this.pivot.rotation.y += 0.01;
        }
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
        const light1 = new THREE.AmbientLight(0xffffff, 3);
        const light2 = new THREE.DirectionalLight(0xffffff, 4);
        light2.position.set(0.5, 0, 0.866); // ~60º
        this.pivot.add(object);
        this.scene = new THREE.Scene();
        this.scene.add(light1);
        this.scene.add(light2);
        this.scene.add(this.pivot);
        if (this.backgroundColor) {
            this.scene.background = new THREE.Color(this.backgroundColor);
        }
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(object.position);

        // object.position.x += (object.position.x - center.x);
        // object.position.y += (object.position.y - center.y);
        // object.position.z += (object.position.z - center.z);

        const { left, right, top, bottom, width, height } = this.modelElement.getBoundingClientRect();
        const areaWidth = width;
        const areaHeight = height;

        const size = box.getSize(new THREE.Vector3()).length();

        console.log('width', width);
        console.log('height', height)

        this.camera = new THREE.PerspectiveCamera(
            50,
            width / height,
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

        object.position.multiplyScalar(- 1);

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
        // gesture.setDisabled(false);
        gesture.destroy();

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

    ngAfterViewChecked() {
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
