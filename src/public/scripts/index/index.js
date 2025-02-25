import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import * as CARDS from "../products/cards.js"
import { loadPage } from '../script.js'
import * as API from "../dependencies/apiMethods.js"
import { showMessagePopup, notificationConfig } from '../dependencies/notification.js';

gsap.registerPlugin(ScrollTrigger)

var scene_principal;
var camera_principal;
var canvas_principal;
var renderer_principal;

var canvas_product;
var camera_product;
var scene_product;
var renderer_product;

var cards;

var button_login;

const ROUTE_HEADPHONES = '../models3D/headphones/audifonosV3.gltf';

var lenis;

var splideList;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const initCanvasProduct = async () => {
    scene_product = new THREE.Scene()

    camera_product = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
    camera_product.position.set(0, 0, 8)
    scene_product.add(camera_product)

    renderer_product = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })
    renderer_product.setSize(sizes.width, sizes.height)

    const p_light = new THREE.PointLight(0xffffff, 1)
    p_light.position.set(0, 0, 0)
    scene_product.add(p_light)

    const p_light_2 = new THREE.PointLight(0xffffff, 2)
    p_light_2.position.set(-10, -5, 0)
    scene_product.add(p_light_2)

    const p_light_3 = new THREE.PointLight(0xffffff, 2)
    p_light_3.position.set(10, -5, 0)
    scene_product.add(p_light_3)

    canvas_product.appendChild(renderer_product.domElement)

    const loader = new GLTFLoader()
    loader.crossOrigin = ""

    await loader.load(ROUTE_HEADPHONES, (gltf) => {
        gltf.scene.traverse(child => {
            child.castShadow = true;
        });
        gltf.scene.position.set(0, -2, 0)
        gltf.scene.rotation.y = 3.15

        scene_product.add(gltf.scene);

        const rotation = gltf.scene.rotation

        let tl = new TimelineLite()

        const camera_position = camera_product.position
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = (e.clientY / window.innerHeight) * 2 + 1

            camera_position.set((x * 0.1), (y * 0.1), 8)
        }, false)

    }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
        (error) => {
            console.log(error)
        })

    const material_point = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const geometry_point = new THREE.CircleGeometry(0.1, 32)

    const point1 = new THREE.Mesh(geometry_point, material_point)
    point1.position.set(2.3, -3, 2)
    scene_product.add(point1)
}

const initCanvasPrincipal = () => {
    scene_principal = new THREE.Scene()

    camera_principal = new THREE.PerspectiveCamera(75, sizes.width / (sizes.height * 3), 0.1, 1000)
    camera_principal.position.set(0, 0, 10)
    scene_principal.add(camera_principal)

    renderer_principal = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })
    renderer_principal.setSize(sizes.width, sizes.height * 3)

    const p_light = new THREE.PointLight(0xffffff, 1)
    p_light.position.set(-10, 10, 10)
    scene_principal.add(p_light)

    const p_light_2 = new THREE.PointLight(0xffffff, 1)
    p_light_2.position.set(-30, 0, 10)
    scene_principal.add(p_light_2)

    canvas_principal.appendChild(renderer_principal.domElement)

    const loader = new GLTFLoader()
    loader.crossOrigin = ""

    loader.load(ROUTE_HEADPHONES, (gltf) => {
        gltf.scene.traverse(child => {
            child.castShadow = true;
        });
        gltf.scene.rotation.x = 0.3
        gltf.scene.rotation.z = 0.1
        gltf.scene.position.set(-15, 6, -6)

        scene_principal.add(gltf.scene);

        const position = gltf.scene.position
        const rotation = gltf.scene.rotation
        let tl = new TimelineLite({
            onStart: function () { loadPage() },
            onComplete: function () { completeAnimation(position, rotation) }
        })

        tl.to(position, { x: 2, duration: 3, ease: "power4.inOut" }, 0)
            .to(rotation, { y: 5.3, duration: 3, ease: "power4.inOut" }, 0)

        showAnimations(tl)

    }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
        (error) => {
            console.log(error)
        })

    const showAnimations = (tl) => {
        const chars = document.querySelector('.phrase')
        const button_more = document.querySelector('.button_more')
        const title = document.querySelector('.unitec')
        const price = document.querySelector('.price')

        const char_title = new SplitType(title, { types: "chars" });

        tl.to(char_title.chars, {
            xPercent: 20,
            opacity: 1,
            stagger: 0.02,
            duration: 3,
            ease: 'back.out'
        }, 0.5)

        tl.to(button_more, {
            yPercent: -150,
            opacity: 1,
            stagger: 0.05,
            ease: "power3.inOut",
            duration: 1.5
        }, 1.2)

        tl.to(chars, {
            yPercent: -80,
            opacity: 1,
            stagger: 0.05,
            ease: "power4.inOut",
            duration: 2
        }, 0.5)
    }

    const completeAnimation = (position, rotation) => {
        let tl = new TimelineLite()

        tl.to(position, {
            x: 12,
            scrollTrigger: {
                trigger: ".canvas-container",
                start: "500px center",
                end: "1000px center",
                scrub: 1,
                ease: "back.inOut(1.7)",
            },
        })

        tl.to(rotation, {
            y: 6,
            scrollTrigger: {
                trigger: ".canvas-container",
                start: "500px center",
                end: "1000 center",
                scrub: 1,
                ease: "back.inOut(1.7)"
            },
        })

        /*
        window.addEventListener('mousemove', (e)=>{
        const x = (e.clientX / window.innerWidth) * 2 - 1 
        
        console.log(x);

        rotation.y = x
        }, false)
        */
    }
}

export default async () => {
    lenis = new Lenis()
    canvas_principal = document.querySelector('.canvas-principal')
    canvas_product = document.querySelector('.canvas-product')
    button_login = document.querySelector('.order-btn')
    splideList = document.querySelector('.splide__list')

    initCanvasPrincipal()
    initCanvasProduct()

    await loadData();

    var splide = new Splide('.splide', {
        perPage: 2,
        perMove: 1,
        arrows: true,
        pagination: false
    })

    await validateSessionButton();
    window.addEventListener('pageshow', async (e) => {
        if (e.persisted) {
            await validateSessionButton();
        }
    })

    splide.mount()

    animate()
    requestAnimationFrame(raf)

    addNewVisit();
}

function addNewVisit() {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var formatedDay = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

    API.executeConsult(formatedDay, 'visits_by_date').then(
        function (value) {
            if (value.length == 0) {
                API.executeInsert(JSON.stringify({
                    date: formatedDay,
                    quantity: 1
                }), 'visits')
                    .then(function (value) { addNewVisit() }, function (error) { console.log(error) })
            } else {
                var visit = value[0];
                var id = visit.id;

                visit.quantity = parseInt(visit.quantity) + 1;
                delete visit.id
                API.executeUpdate(JSON.stringify(visit), id, 'visits')
                    .then(function () { }, function (error) { console.log(error); })
            }
        },
        function (error) {
            console.log(error);
        }
    )
}

async function validateSessionButton() {
    const response = await fetch('../validateSession', {
        method: 'GET'
    })

    const data = response.text();
    var url;
    const data_response = await data.then(res => {
        return JSON.parse(res);
    })

    if (data_response.sessionExpires) {
        url = '../login';
    } else {
        url = data_response.url;
    }

    button_login.addEventListener('click', () => {
        window.location = url
    })
}

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

function animate() {
    renderer_principal.render(scene_principal, camera_principal)
    renderer_product.render(scene_product, camera_product)
    requestAnimationFrame(animate)
}

const loadData = async () => {
    await API.executeConsult(null, 'products')
        .then(
            async function (value) {
                await showProducts(value);
            },
            function (error) {
                notificationConfig.text = "Error en el servidor"
                notificationConfig.background = "Red"
                showMessagePopup(notificationConfig)
            }
        )
}

const showProducts = async (value) => {
    value.forEach(element => {
        var imageData;
        if (parseInt(element.quantityImages) > 0) {
            const images = element.imagesURL;
            const arrayImages = images.split(',');
            imageData = arrayImages[0]
        } else {
            imageData = ''
        }

        const data = {
            id: element.id,
            name: element.name,
            price: element.price,
            url: imageData
        };

        const elementList = CARDS.initCardIndex(data);
        const li = document.createElement('li');
        li.classList.add('splide__slide')

        li.appendChild(elementList);
        splideList.appendChild(li);
    });
}
