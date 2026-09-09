document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("biologyCanvas");

    if (!canvas || typeof THREE === "undefined") {
        return;
    }

    // =========================
    // إعداد المشهد
    // =========================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x0f172a);


    // =========================
    // الكاميرا
    // =========================

    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 6);


    // =========================
    // Renderer
    // =========================

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        canvas.clientWidth,
        canvas.clientHeight,
        false
    );


    // =========================
    // الإضاءة
    // =========================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.8
    );

    scene.add(ambientLight);


    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    directionalLight.position.set(
        4,
        5,
        6
    );

    scene.add(directionalLight);


    const pointLight = new THREE.PointLight(
        0x60a5fa,
        15,
        20
    );

    pointLight.position.set(
        -4,
        2,
        4
    );

    scene.add(pointLight);


    // =========================
    // مجموعة القلب
    // =========================

    const heartGroup = new THREE.Group();

    scene.add(heartGroup);


    // =========================
    // إنشاء شكل القلب
    // =========================

    function heartShape(t, scale = 1) {

        const x =
            16 *
            Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        return {
            x: x * scale,
            y: y * scale
        };
    }


    // =========================
    // نقاط القلب
    // =========================

    const points = [];

    const layers = 22;
    const pointsPerLayer = 80;

    for (let layer = 0; layer < layers; layer++) {

        const z =
            (layer / (layers - 1) - 0.5) * 1.8;

        const depthScale =
            0.82 +
            0.18 *
            Math.sin(
                (layer / (layers - 1)) *
                Math.PI
            );

        for (
            let i = 0;
            i < pointsPerLayer;
            i++
        ) {

            const t =
                (i / pointsPerLayer) *
                Math.PI *
                2;

            const p =
                heartShape(
                    t,
                    0.105
                );

            points.push(
                new THREE.Vector3(
                    p.x * depthScale,
                    p.y * depthScale,
                    z
                )
            );
        }
    }


    // =========================
    // هندسة القلب
    // =========================

    const geometry =
        new THREE.BufferGeometry();

    geometry.setFromPoints(points);


    // =========================
    // مادة القلب
    // =========================

    const material =
        new THREE.PointsMaterial({
            color: 0xef4444,
            size: 0.055,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true
        });


    const heart =
        new THREE.Points(
            geometry,
            material
        );

    heartGroup.add(heart);


    // =========================
    // إضافة شكل داخلي
    // =========================

    const innerGeometry =
        new THREE.SphereGeometry(
            0.65,
            32,
            32
        );

    const innerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x991b1b,
            roughness: 0.75,
            metalness: 0.05,
            transparent: true,
            opacity: 0.45
        });

    const innerHeart =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );

    innerHeart.scale.set(
        0.8,
        1.15,
        0.8
    );

    heartGroup.add(innerHeart);


    // =========================
    // أوعية دموية بسيطة
    // =========================

    function createVessel(
        start,
        end,
        radius
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(end, start);

        const length =
            direction.length();

        const vesselGeometry =
            new THREE.CylinderGeometry(
                radius,
                radius * 1.15,
                length,
                16
            );

        const vesselMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xdc2626,
                roughness: 0.6,
                metalness: 0.05
            });

        const vessel =
            new THREE.Mesh(
                vesselGeometry,
                vesselMaterial
            );

        const midpoint =
            new THREE.Vector3()
                .addVectors(start, end)
                .multiplyScalar(0.5);

        vessel.position.copy(midpoint);

        vessel.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        heartGroup.add(vessel);

    }


    createVessel(
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0, 2.0, 0),
        0.16
    );


    createVessel(
        new THREE.Vector3(0.25, 0.9, 0),
        new THREE.Vector3(0.55, 1.7, 0),
        0.11
    );


    // =========================
    // تحريك القلب
    // =========================

    heartGroup.rotation.y = 0.25;

    heartGroup.rotation.x = -0.1;


    let autoRotate = true;


    // =========================
    // زر الدوران
    // =========================

    const rotateButton =
        document.getElementById(
            "rotateToggle"
        );

    if (rotateButton) {

        rotateButton.addEventListener(
            "click",
            () => {

                autoRotate =
                    !autoRotate;

                rotateButton.textContent =
                    autoRotate
                        ? "⏸ إيقاف الدوران"
                        : "▶ تشغيل الدوران";

            }
        );

    }


    // =========================
    // زر إعادة الضبط
    // =========================

    const resetButton =
        document.getElementById(
            "resetModel"
        );

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                heartGroup.rotation.set(
                    -0.1,
                    0.25,
                    0
                );

                camera.position.set(
                    0,
                    0,
                    6
                );

            }
        );

    }


    // =========================
    // تحريك باللمس والسحب
    // =========================

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;


    canvas.addEventListener(
        "pointerdown",
        (event) => {

            isDragging = true;

            previousX = event.clientX;
            previousY = event.clientY;

            canvas.setPointerCapture(
                event.pointerId
            );

        }
    );


    canvas.addEventListener(
        "pointermove",
        (event) => {

            if (!isDragging) {
                return;
            }

            const deltaX =
                event.clientX -
                previousX;

            const deltaY =
                event.clientY -
                previousY;

            heartGroup.rotation.y +=
                deltaX * 0.01;

            heartGroup.rotation.x +=
                deltaY * 0.01;

            previousX =
                event.clientX;

            previousY =
                event.clientY;

        }
    );


    canvas.addEventListener(
        "pointerup",
        () => {

            isDragging = false;

        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {

            isDragging = false;

        }
    );


    // =========================
    // تكبير وتصغير باللمس
    // =========================

    let currentZoom = 6;

    canvas.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            currentZoom +=
                event.deltaY * 0.005;

            currentZoom =
                Math.max(
                    3,
                    Math.min(
                        10,
                        currentZoom
                    )
                );

            camera.position.z =
                currentZoom;

        },
        { passive: false }
    );


    // =========================
    // تغيير الحجم
    // =========================

    function resizeRenderer() {

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;

        if (
            width === 0 ||
            height === 0
        ) {
            return;
        }

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height,
            false
        );

    }


    window.addEventListener(
        "resize",
        resizeRenderer
    );


    resizeRenderer();


    // =========================
    // Animation
    // =========================

    function animate() {

        requestAnimationFrame(
            animate
        );


        if (autoRotate && !isDragging) {

            heartGroup.rotation.y +=
                0.005;

        }


        // نبض القلب

        const pulse =
            1 +
            Math.sin(
                performance.now() * 0.003
            ) * 0.015;

        heartGroup.scale.set(
            pulse,
            pulse,
            pulse
        );


        renderer.render(
            scene,
            camera
        );

    }


    animate();

});
