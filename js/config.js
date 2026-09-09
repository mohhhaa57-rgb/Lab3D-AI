/*
====================================================
Lab3D AI
Central Configuration
====================================================

هذا الملف هو مركز إعدادات الموقع.
عند إضافة API أو شبكة إعلانية لاحقاً،
نضع الإعدادات هنا بدلاً من تعديل صفحات الموقع.
*/

const LAB3D_CONFIG = {

    // معلومات الموقع
    site: {
        name: "Lab3D AI",
        description:
            "منصة تعليمية تفاعلية للعلوم بتقنية ثلاثية الأبعاد",
        language: "ar",
        direction: "rtl",
        version: "1.0.0"
    },


    // ==========================================
    // AI Mentor
    // ==========================================

    ai: {

        enabled: true,

        /*
        لا تضع مفتاح API الحقيقي هنا في الموقع
        إذا كان الموقع منشوراً للعامة.

        لاحقاً سنضع الاتصال بالـ API في Backend
        لحماية المفتاح.
        */

        provider: "demo",

        allowedSubjects: [
            "biology",
            "chemistry",
            "physics"
        ],

        maxMessageLength: 2000

    },


    // ==========================================
    // الإعلانات
    // ==========================================

    ads: {

        enabled: true,


        // Google AdSense

        google: {

            enabled: false,

            publisherId: "",

            /*
            مثال:
            ca-pub-XXXXXXXXXXXXXXXX
            */

        },


        // منصة إعلانية ثانية

        network2: {

            enabled: false,

            name: "",

            scriptUrl: "",

            publisherId: ""

        },


        // منصة إعلانية ثالثة مستقبلية

        network3: {

            enabled: false,

            name: "",

            scriptUrl: "",

            publisherId: ""

        },


        /*
        ترتيب أولوية الشبكات الإعلانية.

        يمكن تغييره لاحقاً.
        */

        priority: [
            "google",
            "network2",
            "network3"
        ],


        // أماكن الإعلانات

        placements: {

            homepageTop: true,

            homepageMiddle: true,

            homepageBottom: true,

            subjectTop: true,

            subjectMiddle: true,

            subjectBottom: true,

            mobileSticky: false

        }

    },


    // ==========================================
    // Rewarded Ads
    // ==========================================

    rewardedAds: {

        enabled: true,

        /*
        مدة الإعلان التجريبي.
        لاحقاً يمكن ربطه بشبكة Rewarded حقيقية.
        */

        demoDuration: 5,

        rewardType: "save_model",

        requireLogin: true

    },


    // ==========================================
    // النماذج ثلاثية الأبعاد
    // ==========================================

    models: {

        enabled: true,

        watermark: {

            enabled: true,

            text: "Lab3D AI",

            opacity: 0.65

        }

    },


    // ==========================================
    // الحسابات
    // ==========================================

    authentication: {

        mode: "local",

        allowRegistration: true,

        allowGuestBrowsing: true

    },


    // ==========================================
    // التخزين المحلي
    // ==========================================

    storage: {

        user: "lab3d_user",

        savedModels: "lab3d_saved_models",

        favorites: "lab3d_favorites",

        theme: "lab3d_theme",

        settings: "lab3d_settings"

    },


    // ==========================================
    // الأقسام العلمية
    // ==========================================

    subjects: [

        {
            id: "biology",
            name: "الأحياء",
            englishName: "Biology",
            icon: "🧬",
            enabled: true
        },

        {
            id: "chemistry",
            name: "الكيمياء",
            englishName: "Chemistry",
            icon: "⚗️",
            enabled: true
        },

        {
            id: "physics",
            name: "الفيزياء",
            englishName: "Physics",
            icon: "⚡",
            enabled: true
        }

    ]

};


// ==========================================
// دوال مساعدة
// ==========================================

function getLab3DConfig() {

    return LAB3D_CONFIG;

}


function isSubjectAllowed(subject) {

    return LAB3D_CONFIG.ai.allowedSubjects
        .includes(subject);

}


function getStorageKey(name) {

    return LAB3D_CONFIG.storage[name];

}
