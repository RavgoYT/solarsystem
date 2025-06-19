import { orbitControlsConfig } from '../config/config.js';

export function createOrbitControls(camera, domElement) {
    class OrbitControls {

        // Basic default orbit controls with some customizations.
        constructor(camera, domElement) {
            this.camera = camera;
            this.domElement = domElement;
            this.target = new THREE.Vector3();
            this.enableDamping = true;
            this.dampingFactor = 0.05;
            this.enableZoom = true;
            this.enableRotate = true;
            this.enablePan = true;
            this.rotateSpeed = 0.5;
            this.zoomSpeed = 1.0;
            this.panSpeed = 0.8;
            this.minDistance = 10;
            this.maxDistance = 80000;
            this.spherical = new THREE.Spherical();
            this.sphericalDelta = new THREE.Spherical();
            this.scale = 1;
            this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
            this.rotatingState = false;
            this.zoomingState = false;
            this.panningState = false;
            this.rotateStart = new THREE.Vector2();
            this.rotateEnd = new THREE.Vector2();
            this.rotateDelta = new THREE.Vector2();
            this.panStart = new THREE.Vector2();
            this.panEnd = new THREE.Vector2();
            this.panDelta = new THREE.Vector2();
            this.dollyStart = new THREE.Vector2();
            this.dollyEnd = new THREE.Vector2();
            this.dollyDelta = new THREE.Vector2();
            this.setupEventListeners();
            this.update();
        }
        setupEventListeners() {
            this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
            this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
            this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
            document.addEventListener('mousemove', this.onMouseMove.bind(this));
            document.addEventListener('mouseup', this.onMouseUp.bind(this));
        }
        onMouseDown(event) {
            switch (event.button) {
                case this.mouseButtons.LEFT:
                    if (this.enableRotate) {
                        this.rotateStart.set(event.clientX, event.clientY);
                        this.rotatingState = true;
                    }
                    break;
                case this.mouseButtons.MIDDLE:
                    if (this.enableZoom) {
                        this.dollyStart.set(event.clientX, event.clientY);
                        this.zoomingState = true;
                    }
                    break;
                case this.mouseButtons.RIGHT:
                    if (this.enablePan) {
                        this.panStart.set(event.clientX, event.clientY);
                        this.panningState = true;
                    }
                    break;
            }
        }
        onMouseMove(event) {
            if (this.rotatingState && this.enableRotate) {
                this.rotateEnd.set(event.clientX, event.clientY);
                this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
                this.sphericalDelta.theta -= 2 * Math.PI * this.rotateDelta.x / this.domElement.clientHeight * this.rotateSpeed;
                this.sphericalDelta.phi -= 2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight * this.rotateSpeed;
                this.rotateStart.copy(this.rotateEnd);
            }
            if (this.zoomingState && this.enableZoom) {
                this.dollyEnd.set(event.clientX, event.clientY);
                this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
                if (this.dollyDelta.y > 0) {
                    this.scale *= 1.05;
                } else if (this.dollyDelta.y < 0) {
                    this.scale /= 1.05;
                }
                this.dollyStart.copy(this.dollyEnd);
            }
        }
        onMouseUp() {
            this.rotatingState = false;
            this.zoomingState = false;
            this.panningState = false;
        }
        onMouseWheel(event) {
            event.preventDefault();
            if (this.enableZoom) {
                const zoomScale = event.deltaY > 0 ? 1.1 : 0.9;
                const distance = this.camera.position.distanceTo(this.target);
                const newDistance = Math.max(this.minDistance, Math.min(this.maxDistance, distance * zoomScale));
                const direction = new THREE.Vector3().subVectors(this.camera.position, this.target).normalize();
                this.camera.position.copy(this.target).add(direction.multiplyScalar(newDistance));
            }
        }
        update() {
            const offset = new THREE.Vector3().subVectors(this.camera.position, this.target);
            this.spherical.setFromVector3(offset);
            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;
            this.spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.spherical.phi));
            if (this.scale !== 1) {
                this.spherical.radius *= this.scale;
                this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
            }
            offset.setFromSpherical(this.spherical);
            this.camera.position.copy(this.target).add(offset);
            this.camera.lookAt(this.target);
            if (this.enableDamping) {
                this.sphericalDelta.theta *= (1 - this.dampingFactor);
                this.sphericalDelta.phi *= (1 - this.dampingFactor);
                this.scale = 1 + (this.scale - 1) * (1 - this.dampingFactor);
            } else {
                this.sphericalDelta.set(0, 0, 0);
                this.scale = 1;
            }
            return false;
        }
    }
    const controls = new OrbitControls(camera, domElement);
    return controls;
}