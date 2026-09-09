/* =========================================================
   BAHNSAWY COFFEE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const preloader =
    document.getElementById("preloader");

const navbar =
    document.getElementById("navbar");

const hero =
    document.querySelector(".hero");

const heroLeft =
    document.getElementById("heroLeft");

const heroRight =
    document.getElementById("heroRight");

const heroCenter =
    document.getElementById("heroCenter");

const heroLine =
    document.getElementById("heroLine");

const heroVideoContainer =
    document.getElementById("heroVideoContainer");

const heroVideo =
    document.getElementById("heroVideo");

const videoContent =
    document.querySelector(".video-content");

const videoSound =
    document.getElementById("videoSound");


/* =========================================================
   PRELOADER
========================================================= */

setTimeout(() => {

    preloader.classList.add("hide");

    preloader.style.opacity = "0";

    preloader.style.visibility = "hidden";

    preloader.style.pointerEvents = "none";

    preloader.style.display = "none";

}, 650);


/* =========================================================
   VIDEO
========================================================= */

heroVideo.muted = true;

heroVideo.autoplay = true;

heroVideo.loop = true;

heroVideo.playsInline = true;

heroVideo.play().catch(() => {

    console.log(
        "Video autoplay blocked by browser."
    );

});


videoSound.addEventListener("click", () => {

    heroVideo.muted = !heroVideo.muted;

    videoSound.setAttribute(
        "aria-pressed",
        String(!heroVideo.muted)
    );

    videoSound.setAttribute(
        "aria-label",
        heroVideo.muted
            ? "تشغيل صوت الفيديو"
            : "كتم صوت الفيديو"
    );

    videoSound.querySelector(".sound-icon").textContent =
        heroVideo.muted ? "🔇" : "🔊";

    videoSound.querySelector(".sound-label").textContent =
        heroVideo.muted ? "تشغيل الصوت" : "كتم الصوت";

    heroVideo.play().catch(() => {

        heroVideo.muted = true;

    });

});


/* =========================================================
   CLAMP
========================================================= */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


/* =========================================================
   EASE
========================================================= */

function easeInOut(t) {

    return t < 0.5

        ? 2 * t * t

        : 1 -
          Math.pow(
              -2 * t + 2,
              2
          ) / 2;

}


/* =========================================================
   HERO SCROLL ANIMATION
========================================================= */

function updateHero() {

    const rect =
        hero.getBoundingClientRect();

    const totalScroll =
        hero.offsetHeight -
        window.innerHeight;


    if (totalScroll <= 0) {

        return;

    }


    let progress =
        -rect.top /
        totalScroll;


    progress =
        clamp(
            progress,
            0,
            1
        );


    /* =====================================================
       IMAGE EXIT
    ===================================================== */

    const imageProgress =
        clamp(
            progress / 0.52,
            0,
            1
        );


    const imageEase =
        easeInOut(
            imageProgress
        );


    /*
       LEFT
       يخرج إلى الشمال

       RIGHT
       يخرج إلى اليمين
    */

    const leftX =
        -110 *
        imageEase;


    const rightX =
        110 *
        imageEase;


    heroLeft.style.transform =
        `translate3d(${leftX}%,0,0)`;


    heroRight.style.transform =
        `translate3d(${rightX}%,0,0)`;


    /* =====================================================
       CENTER LOGO
    ===================================================== */

    const logoProgress =
        clamp(
            progress / 0.32,
            0,
            1
        );


    const logoEase =
        easeInOut(
            logoProgress
        );


    const logoScale =
        1 -
        (
            logoEase *
            .65
        );


    heroCenter.style.transform =
        `
        translate(-50%,-50%)
        scale(${logoScale})
        `;


    heroCenter.style.opacity =
        1 -
        logoEase;


    /* =====================================================
       CENTER LINE
    ===================================================== */

    const lineProgress =
        clamp(
            (progress - .08) / .25,
            0,
            1
        );


    const lineEase =
        easeInOut(
            lineProgress
        );


    heroLine.style.transform =
        `
        translateX(-50%)
        scaleY(${1 - lineEase})
        `;


    heroLine.style.opacity =
        1 -
        lineEase;


    /* =====================================================
       VIDEO
    ===================================================== */

    /*
       الفيديو يبدأ بعد خروج
       الصور قليلًا.
    */

    const videoProgress =
        clamp(
            (progress - .10) / .70,
            0,
            1
        );


    const videoEase =
        easeInOut(
            videoProgress
        );


    const videoWidth =
        videoEase *
        100;


    const videoHeight =
        videoEase *
        100;


    heroVideoContainer.style.width =
        `${videoWidth * document.documentElement.clientWidth / 100}px`;


    heroVideoContainer.style.height =
        `${videoHeight * window.innerHeight / 100}px`;


    /* =====================================================
       VIDEO CONTENT
    ===================================================== */

    const contentProgress =
        clamp(
            (videoProgress - .70) / .30,
            0,
            1
        );


    videoContent.style.opacity =
        contentProgress;


    /* =====================================================
       SIDE TEXT
    ===================================================== */

    const sideProgress =
        clamp(
            progress / .25,
            0,
            1
        );


    document.querySelectorAll(
        ".hero-side-text"
    ).forEach(element => {

        element.style.opacity =
            1 -
            sideProgress;

    });

}


/* =========================================================
   REQUEST ANIMATION FRAME
========================================================= */

let ticking = false;


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                () => {

                    updateHero();

                    ticking = false;

                }
            );

            ticking = true;

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   NAVBAR SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 60) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIAL HERO
========================================================= */

updateHero();


/* =========================================================
   INTERSECTION OBSERVER
   REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal-section, .reveal-card"
    );


/*
   Add directional reveals only to content after Benefits.
   The hero and the content above it keep their original behavior.
*/

const postBenefits =
    document.querySelectorAll(
        ".benefits, .benefits ~ section, .benefits ~ footer"
    );


const postBenefitsItems =
    document.querySelectorAll(
        `.benefits .benefit,
         .story .story-image,
         .story .story-content,
         .story .story-location,
         .products-section .section-heading,
         .products-section .categories,
         .products-section .product-card,
         .journey .journey-content,
         .journey .journey-step,
         .why-section .why-heading,
         .why-section .why-item,
         .offer .offer-image,
         .offer .offer-content,
         .testimonials .testimonial-heading,
         .testimonials .testimonial-slider,
         .newsletter > div,
         .newsletter .newsletter-form,
         .contact .contact-image,
            .contact .contact-content`
    );


postBenefits.forEach(section => {

    section.classList.add("scroll-scope");

});


postBenefitsItems.forEach((element, index) => {

    element.classList.add("scroll-reveal");

    element.classList.add(
        index % 2 === 0
            ? "from-right"
            : "from-left"
    );

});


const allRevealElements =
    document.querySelectorAll(
        ".reveal-section, .reveal-card, .scroll-reveal"
    );


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                } else {

                    entry.target.classList.remove(
                        "visible"
                    );

                }

            });

        },

        {
            threshold: .12
        }

    );


allRevealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [

    {
        id: 0,

        name:
            "بن البهنساوي المحوج",

        type:
            "BAHNSAWY BLEND",

        price:
            185,

        image:
            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",

        description:
            "توليفة محوجة متوازنة تجمع بين نكهة القهوة الغنية ولمسات التوابل العطرية."
    },


    {
        id: 1,

        name:
            "بن البهنساوي سادة",

        type:
            "PURE COFFEE",

        price:
            320,

        image:
            "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=900&q=85",

        description:
            "بن سادة مختار بعناية لعشاق مذاق القهوة الصافي والقوي."
    },


    {
        id: 2,

        name:
            "إسبريسو مميز",

        type:
            "ESPRESSO",

        price:
            220,

        image:
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",

        description:
            "توليفة إسبريسو غنية بطبقة كريما متوازنة ونكهة عميقة."
    },


    {
        id: 3,

        name:
            "توليفة البهنساوي الخاصة",

        type:
            "SPECIAL BLEND",

        price:
            899,

        image:
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",

        description:
            "باقة خاصة لعشاق القهوة تضم مجموعة مختارة من أفضل منتجات البهنساوي."
    },


    {
        id: 4,

        name:
            "بن تركي فاخر",

        type:
            "TURKISH COFFEE",

        price:
            175,

        image:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",

        description:
            "بن تركي بطعم غني ورائحة مميزة مناسب للتحضير التقليدي."
    },


    {
        id: 5,

        name:
            "بن محوج مخصوص",

        type:
            "SPECIAL BLEND",

        price:
            245,

        image:
            "https://images.unsplash.com/photo-1510707577719-ae7c14805e32?auto=format&fit=crop&w=900&q=85",

        description:
            "توليفة محوجة مخصوصة لمحبي القهوة ذات الطابع العطري القوي."
    }

];


/* =========================================================
   CART
========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem(
            "bahnsawyCart"
        )
    ) || [];


const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );


const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );


const cartItems =
    document.getElementById(
        "cartItems"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


function saveCart() {

    localStorage.setItem(
        "bahnsawyCart",
        JSON.stringify(cart)
    );

}


function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <p>
                    السلة فارغة
                </p>

                <button
                    onclick="
                    closeCart();
                    document.querySelector('#products')
                    .scrollIntoView({behavior:'smooth'})
                    ">

                    ابدأ التسوق

                </button>

            </div>

        `;

    }


    let total = 0;

    let count = 0;


    cart.forEach(
        item => {

            const product =
                products[item.id];


            total +=
                product.price *
                item.quantity;


            count +=
                item.quantity;


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-item";


            element.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.price} جنيه
                    </span>

                    <div class="cart-quantity">

                        <button
                            onclick="
                            changeQuantity(
                                ${item.id},
                                -1
                            )
                            ">
                            −
                        </button>

                        <b>
                            ${item.quantity}
                        </b>

                        <button
                            onclick="
                            changeQuantity(
                                ${item.id},
                                1
                            )
                            ">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="cart-item-remove"
                    onclick="
                    removeFromCart(
                        ${item.id}
                    )
                    ">

                    ×

                </button>

            `;


            cartItems.appendChild(
                element
            );

        }
    );


    cartCount.textContent =
        count;


    cartTotal.textContent =
        total;


    saveCart();

}


function addToCart(id) {

    const existing =
        cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: id,

            quantity: 1

        });

    }


    updateCart();

    openCart();

}


function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) {

        return;

    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== id
            );

    }


    updateCart();

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    updateCart();

}


function openCart() {

    cartDrawer.classList.add(
        "open"
    );

    cartOverlay.classList.add(
        "open"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


function closeCart() {

    cartDrawer.classList.remove(
        "open"
    );

    cartOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


document.getElementById(
    "cartOpen"
).addEventListener(
    "click",
    openCart
);


document.getElementById(
    "cartClose"
).addEventListener(
    "click",
    closeCart
);


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   ADD CART BUTTONS
========================================================= */

document.querySelectorAll(
    ".add-cart"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const id =
                Number(
                    button.dataset.product
                );

            addToCart(id);

        }
    );

});


/* =========================================================
   CATEGORY FILTER
========================================================= */

const categoryButtons =
    document.querySelectorAll(
        ".category"
    );


const productCards =
    document.querySelectorAll(
        ".product-card"
    );


categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons
                    .forEach(
                        btn =>
                            btn.classList
                            .remove("active")
                    );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category;


                productCards.forEach(
                    card => {

                        if (
                            category ===
                            "all"
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                card.dataset.category ===
                                category

                                ? ""

                                : "none";

                        }

                    }
                );

            }
        );

    }
);


/* =========================================================
   PRODUCT MODAL
========================================================= */

const productModal =
    document.getElementById(
        "productModal"
    );


const modalImage =
    document.getElementById(
        "modalImage"
    );


const modalName =
    document.getElementById(
        "modalName"
    );


const modalType =
    document.getElementById(
        "modalType"
    );


const modalPrice =
    document.getElementById(
        "modalPrice"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


let currentModalProduct =
    null;


function openProductModal(id) {

    const product =
        products[id];


    currentModalProduct =
        id;


    modalImage.src =
        product.image;


    modalImage.alt =
        product.name;


    modalName.textContent =
        product.name;


    modalType.textContent =
        product.type;


    modalPrice.textContent =
        product.price;


    modalDescription.textContent =
        product.description;


    productModal.classList.add(
        "open"
    );


    document.body.classList.add(
        "no-scroll"
    );

}


function closeProductModal() {

    productModal.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


document.querySelectorAll(
    ".quick-view"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                openProductModal(
                    Number(
                        button.dataset.product
                    )
                );

            }
        );

    }
);


document.getElementById(
    "modalClose"
).addEventListener(
    "click",
    closeProductModal
);


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            closeProductModal();

        }

    }
);


/* =========================================================
   MODAL ADD
========================================================= */

document.getElementById(
    "modalAdd"
).addEventListener(
    "click",
    () => {

        if (
            currentModalProduct !== null
        ) {

            addToCart(
                currentModalProduct
            );

            closeProductModal();

        }

    }
);


/* =========================================================
   SIZE BUTTONS
========================================================= */

document.querySelectorAll(
    ".size"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                document.querySelectorAll(
                    ".size"
                ).forEach(
                    size =>
                        size.classList
                        .remove("active")
                );


                button.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   WISHLIST
========================================================= */

document.querySelectorAll(
    ".wishlist"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                button.textContent =
                    button.textContent ===
                    "♡"

                    ? "♥"

                    : "♡";

                button.style.color =
                    button.textContent ===
                    "♥"

                    ? "#d9b96e"

                    : "";

            }
        );

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


const mobileNavigation =
    document.getElementById(
        "mobileNavigation"
    );


mobileMenu.addEventListener(
    "click",
    () => {

        mobileNavigation
            .classList.toggle(
                "open"
            );

    }
);


document.querySelectorAll(
    ".mobile-menu-inner a"
).forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                mobileNavigation
                    .classList.remove(
                        "open"
                    );

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

const searchOverlay =
    document.getElementById(
        "searchOverlay"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


document.querySelector(
    ".search-open"
).addEventListener(
    "click",
    () => {

        searchOverlay.classList.add(
            "open"
        );

        document.body.classList.add(
            "no-scroll"
        );

        setTimeout(
            () =>
                searchInput.focus(),
            300
        );

    }
);


document.getElementById(
    "closeSearch"
).addEventListener(
    "click",
    closeSearch
);


function closeSearch() {

    searchOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!query) {

            searchResults.innerHTML =
                "";

            return;

        }


        const results =
            products.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(query)
            );


        searchResults.innerHTML =
            "";


        results.forEach(
            product => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "search-result-item";


                item.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <strong>
                            ${product.name}
                        </strong>

                        <br>

                        <span>
                            ${product.price} جنيه
                        </span>

                    </div>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        closeSearch();

                        openProductModal(
                            product.id
                        );

                    }
                );


                searchResults.appendChild(
                    item
                );

            }
        );

    }
);


/* =========================================================
   TESTIMONIAL SLIDER
========================================================= */

const testimonials =
    document.querySelectorAll(
        ".testimonial"
    );


let testimonialIndex =
    0;


const testimonialNumber =
    document.getElementById(
        "testimonialNumber"
    );


function showTestimonial(index) {

    testimonials.forEach(
        item =>
            item.classList
            .remove("active")
    );


    testimonials[index]
        .classList
        .add("active");


    testimonialNumber.textContent =
        String(
            index + 1
        ).padStart(
            2,
            "0"
        );

}


document.getElementById(
    "testimonialNext"
).addEventListener(
    "click",
    () => {

        testimonialIndex++;

        if (
            testimonialIndex >=
            testimonials.length
        ) {

            testimonialIndex = 0;

        }


        showTestimonial(
            testimonialIndex
        );

    }
);


document.getElementById(
    "testimonialPrev"
).addEventListener(
    "click",
    () => {

        testimonialIndex--;

        if (
            testimonialIndex < 0
        ) {

            testimonialIndex =
                testimonials.length - 1;

        }


        showTestimonial(
            testimonialIndex
        );

    }
);


/* =========================================================
   AUTO TESTIMONIAL
========================================================= */

setInterval(
    () => {

        testimonialIndex++;

        if (
            testimonialIndex >=
            testimonials.length
        ) {

            testimonialIndex = 0;

        }


        showTestimonial(
            testimonialIndex
        );

    },
    6000
);


/* =========================================================
   NEWSLETTER
========================================================= */

document.getElementById(
    "newsletterForm"
).addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const input =
            event.target.querySelector(
                "input"
            );


        if (!input.value) {

            return;

        }


        alert(
            "تم الاشتراك بنجاح ❤️"
        );


        input.value =
            "";

    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.getElementById(
        "cursor"
    );


const cursorText =
    document.getElementById(
        "cursorText"
    );


document.addEventListener(
    "mousemove",
    event => {

        cursor.style.left =
            event.clientX + "px";


        cursor.style.top =
            event.clientY + "px";


        cursorText.style.left =
            event.clientX + "px";


        cursorText.style.top =
            event.clientY + "px";

    }
);


document.querySelectorAll(
    ".product-image, .gold-button, .outline-button"
).forEach(
    element => {

        element.addEventListener(
            "mouseenter",
            () => {

                cursorText.style.opacity =
                    "1";

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                cursorText.style.opacity =
                    "0";

            }
        );

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeCart();

            closeProductModal();

            closeSearch();

            mobileNavigation
                .classList
                .remove("open");

        }

    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateHero();

    }
);


/* =========================================================
   INITIAL CART
========================================================= */

updateCart();
