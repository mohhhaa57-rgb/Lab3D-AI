/*
====================================================
Lab3D AI
Main Application
====================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    initializeMobileMenu();

    initializeUserState();

    initializeGlobalEvents();

});


// ==================================================
// THEME
// ==================================================

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            getStorageKey("theme")
        );


    if (savedTheme === "dark") {

        document.documentElement
            .classList.add("dark");

    }

    else if (savedTheme === "light") {

        document.documentElement
            .classList.remove("dark");

    }

    else {

        // استخدام إعداد الجهاز

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        if (prefersDark) {

            document.documentElement
                .classList.add("dark");

        }

    }

}


function toggleTheme() {

    const html =
        document.documentElement;


    const isDark =
        html.classList.toggle("dark");


    localStorage.setItem(

        getStorageKey("theme"),

        isDark ? "dark" : "light"

    );


    updateThemeIcon();

}


function updateThemeIcon() {

    const buttons =
        document.querySelectorAll(
            "[data-theme-button]"
        );


    const isDark =
        document.documentElement
            .classList.contains("dark");


    buttons.forEach(button => {

        button.textContent =
            isDark ? "☀️" : "🌙";

    });

}


// ==================================================
// MOBILE MENU
// ==================================================

function initializeMobileMenu() {

    const button =
        document.querySelector(
            "[data-mobile-menu-button]"
        );


    const menu =
        document.querySelector(
            "[data-mobile-menu]"
        );


    if (!button || !menu) return;


    button.addEventListener(
        "click",
        () => {

            menu.classList.toggle("hidden");

        }
    );

}


// ==================================================
// USER STATE
// ==================================================

function initializeUserState() {

    if (typeof getCurrentUser !== "function") {
        return;
    }


    const user =
        getCurrentUser();


    const loginButtons =
        document.querySelectorAll(
            "[data-login-button]"
        );


    const profileElements =
        document.querySelectorAll(
            "[data-user-name]"
        );


    if (user) {

        loginButtons.forEach(button => {

            button.textContent =
                "👤 " + user.username;

            button.onclick = () => {

                window.location.href =
                    "profile.html";

            };

        });


        profileElements.forEach(element => {

            element.textContent =
                user.username;

        });

    }

}


// ==================================================
// GLOBAL EVENTS
// ==================================================

function initializeGlobalEvents() {

    updateThemeIcon();


    // إغلاق النوافذ عند الضغط خارجها

    document.addEventListener(
        "click",
        event => {

            const modal =
                event.target.closest(
                    ".lab3d-modal"
                );


            if (
                modal &&
                event.target === modal
            ) {

                closeModal(modal);

            }

        }
    );

}


// ==================================================
// MODALS
// ==================================================

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal(modal) {

    if (!modal) return;


    modal.classList.remove("active");


    if (
        !document.querySelector(
            ".lab3d-modal.active"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


function closeModalById(id) {

    const modal =
        document.getElementById(id);


    closeModal(modal);

}


// ==================================================
// TOAST NOTIFICATIONS
// ==================================================

function showToast(
    message,
    type = "info"
) {

    let container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `lab3d-toast ${type}`;


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(() => {

        toast.classList.add(
            "hide"
        );


        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}


// ==================================================
// SAFE HTML ESCAPE
// ==================================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatArabicDate(date) {

    return new Intl.DateTimeFormat(
        "ar-IQ",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(
        new Date(date)
    );

}
