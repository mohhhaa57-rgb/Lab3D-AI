document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("chemistryCanvas");

    if (!canvas || typeof THREE === "undefined") {
        return;
    }

    // =========================
    // المشهد
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

    camera.position.set(0, 0.5, 6);


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

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.8
        );

    scene.add(ambientLight);


    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    mainLight.position.set(
        4,
        5,
        6
    );

    scene.add(mainLight);


    const purpleLight =
        new THREE.PointLight(
            0x8b5cf6,
            12,
            20
        );

    purpleLight.position.set(
        -3,
        2,
        4
    );

    scene.add(purpleLight);


    // =========================
    // مجموعة الجزيء
    // =========================

    const molecule =
        new THREE.Group();

    scene.add(molecule);


    // =========================
    // إنشاء الذرات
    // =========================

    function createAtom(
        radius,
        color,
        position
    ) {

        const geometry =
            new THREE.SphereGeometry(
                radius,
                48,
                48
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.35,
                metalness: 0.08
            });

        const atom =
            new THREE.Mesh(
                geometry,
                material
            );

        atom.position.copy(position);

        molecule.add(atom);

        return atom;
    }


    // =========================
    // ذرة الأكسجين
    // =========================

    createAtom(
        0.75,
        0xef4444,
        new THREE.Vector3(
            0,
            0.25,
            0
        )
    );


    // =========================
    // ذرتا الهيدروجين
    // =========================

    createAtom(
        0.45,
        0xf8fafc,
        new THREE.Vector3(
            -1.0,
            0.9,
            0
        )
    );


    createAtom(
        0.45,
        0xf8fafc,
        new THREE.Vector3(
            1.0,
            0.9,
            0
        )
    );


    // =========================
    // إنشاء الروابط
    // =========================

    function createBond(
        start,
        end
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                );

        const length =
            direction.length();

        const geometry =
            new THREE.CylinderGeometry(
                0.12,
                0.12,
                length,
                24
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xcbd5e1,
                roughness: 0.4,
                metalness: 0.1
            });

        const bond =
            new THREE.Mesh(
                geometry,
                material
            );

        const midpoint =
            new THREE.Vector3()
                .addVectors(
                    start,
                    end
                )
                .multiplyScalar(0.5);

        bond.position.copy(midpoint);

        bond.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        molecule.add(bond);

    }


    const oxygenPosition =
        new THREE.Vector3(
            0,
            0.25,
            0
        );

    const hydrogenLeft =
        new THREE.Vector3(
            -1.0,
            0.9,
            0
        );

    const hydrogenRight =
        new THREE.Vector3(
            1.0,
            0.9,
            0
        );


    createBond(
        oxygenPosition,
        hydrogenLeft
    );

    createBond(
        oxygenPosition,
        hydrogenRight
    );


    // =========================
    // إلكترونات تمثيلية
    // =========================

    const electronGroup =
        new THREE.Group();

    molecule.add(
        electronGroup
    );


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const angle =
            (i / 4) *
            Math.PI *
            2;

        const electronGeometry =
            new THREE.SphereGeometry(
                0.07,
                16,
                16
            );

        const electronMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x60a5fa,
                emissive: 0x1d4ed8,
                emissiveIntensity: 0.8
            });

        const electron =
            new THREE.Mesh(
                electronGeometry,
                electronMaterial
            );

        electron.position.set(
            Math.cos(angle) * 1.15,
            0.2,
            Math.sin(angle) * 1.15
        );

        electronGroup.add(
            electron
        );

    }


    // =========================
    // الدوران
    // =========================

    let autoRotate = true;


    const rotateButton =
        document.getElementById(
            "chemRotateToggle"
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
    // إعادة الضبط
    // =========================

    const resetButton =
        document.getElementById(
            "chemReset"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                molecule.rotation.set(
                    0,
                    0,
                    0
                );

                camera.position.set(
                    0,
                    0.5,
                    6
                );

            }
        );

    }


    // =========================
    // السحب باللمس
    // =========================

    let isDragging = false;

    let previousX = 0;
    let previousY = 0;


    canvas.addEventListener(
        "pointerdown",
        (event) => {

            isDragging = true;

            previousX =
                event.clientX;

            previousY =
                event.clientY;

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

            molecule.rotation.y +=
                deltaX * 0.01;

            molecule.rotation.x +=
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
    // التكبير والتصغير
    // =========================

    let zoom = 6;


    canvas.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            zoom +=
                event.deltaY * 0.005;

            zoom =
                Math.max(
                    3,
                    Math.min(
                        10,
                        zoom
                    )
                );

            camera.position.z =
                zoom;

        },
        {
            passive: false
        }
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


        if (
            autoRotate &&
            !isDragging
        ) {

            molecule.rotation.y +=
                0.006;

        }


        electronGroup.rotation.y +=
            0.01;


        renderer.render(
            scene,
            camera
        );

    }


    animate();

});
