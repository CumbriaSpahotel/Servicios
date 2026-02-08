import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * db.js
 * Handles data persistence for Cumbria Guest Portal
 * Uses Firebase Firestore v9 (Modular)
 */

const DB_KEY = 'cumbria_services_v1';
const DB_COLLECTION = 'hotels'; // Structure: hotels/cumbria/services/general
const HISTORY_COLLECTION = 'menu_history'; // Subcollection for history

const DEFAULT_DATA = {
    restaurante: {
        active: true,
        showCarta: true,
        title: "Restaurante Cumbria",
        desc: "Cocina de mercado con productos de la tierra.",
        schedule: "13:30 - 16:00 / 20:00 - 23:00 (Dom. Noche Cerrado)",
        dailyMenu: {
            active: false,
            price: "20,00",
            date: "",
            includes: "Incluido postre, pan, y una bebida\n(Agua, refresco, copa de vino o caña)",
            starters: [],
            mains: []
        },
        categories: [
            {
                name: "Entrantes",
                items: [
                    { name: "Jamón Ibérico Bellota", desc: "Con pan de cristal", price: "19.00" },
                    { name: "Queso Manchego D.O.", desc: "Selección especial", price: "24.00" },
                    { name: "Ensalada de Perdiz", desc: "En escabeche casero", price: "14.00" },
                    { name: "Chopito Nacional", desc: "Andaluza con alioli lima", price: "15.00" },
                    { name: "Parrillada Verduras", desc: "De temporada", price: "14.00" }
                ]
            },
            {
                name: "Principales",
                items: [
                    { name: "Cochinillo Asado", desc: "Crujiente a baja temp.", price: "17.00" },
                    { name: "Solomillo Ternera", desc: "Salsa foie y trufa", price: "19.00" },
                    { name: "Paletilla Lechal", desc: "Deshuesada en su jugo", price: "18.00" },
                    { name: "Bacalao Confitado", desc: "Sobre pisto manchego", price: "16.00" }
                ]
            }
        ]
    },
    roomService: {
        active: true,
        ext: "1181",
        surcharge: "3.00",
        categories: [
            {
                name: "Ensaladas & Entrantes",
                items: [
                    { name: "Perdiz en escabeche", desc: "Con pimientos asados", price: "15.00" },
                    { name: "Queso y Cecina", desc: "De cabra", price: "12.00" },
                    { name: "Mixta Completa", desc: "Atún, huevo, tomate", price: "10.00" }
                ]
            },
            {
                name: "Sándwiches & Bocadillos",
                items: [
                    { name: "Sándwich Club", desc: "Pollo, bacon, huevo, queso", price: "7.00" },
                    { name: "Sándwich Mixto", desc: "Jamón y queso", price: "3.50" },
                    { name: "Bocadillo Lomo", desc: "A la plancha", price: "7.00" },
                    { name: "Bocadillo Jamón", desc: "Ibérico", price: "10.50" }
                ]
            },
            {
                name: "Principales",
                items: [
                    { name: "Hamburguesa Buey", desc: "Rúcula y gorgonzola", price: "9.00" },
                    { name: "Entrecot con huevo", desc: "Y patatas fritas", price: "19.00" },
                    { name: "Sartén Huevos Rotos", desc: "Con jamón", price: "12.00" },
                    { name: "Pizza Individual", desc: "Jamón y queso", price: "9.00" }
                ]
            }
        ]
    },
    cafeteria: {
        active: true,
        schedule: "08:00 - 24:00",
        items: [
            { name: "Café Expreso", price: "1.80" },
            { name: "Café con Leche", price: "2.00" },
            { name: "Refrescos", price: "3.00" },
            { name: "Cerveza Nacional", price: "3.50" },
            { name: "Sandwich Mixto", price: "5.00" }
        ]
    },
    minibar: {
        active: true,
        desc: "¡Disfruta tu momento relax! El minibar te espera con bebidas frías y snacks para que te sientas como en casa durante tu estancia. Si quieres añadir algo diferente, nuestro equipo en recepción está disponible para ti.",
        categories: [
            {
                name: "En el minibar de tu habitación",
                items: [
                    { name: "Agua mineral", price: "1,50" },
                    { name: "Agua con gas", price: "1,65" },
                    { name: "Patatas fritas", price: "2,20" },
                    { name: "Mikado Chocolate", price: "2,20" }
                ]
            },
            {
                name: "Disponibles en recepción (bajo petición)",
                items: [
                    { name: "Tónica / Tonic water", price: "2,00" },
                    { name: "Refresco de naranja / Orange drink", price: "2,00" },
                    { name: "Refresco de limón / Lemon drink", price: "2,00" },
                    { name: "Coca Cola / Coke", price: "2,00" },
                    { name: "Zumo / Juice", price: "2,00" },
                    { name: "Cerveza / Beer", price: "3,00" },
                    { name: "Ginebra / Gin", price: "4,50" },
                    { name: "Vodka", price: "4,50" },
                    { name: "Ron / Rum", price: "4,50" },
                    { name: "Whisky", price: "4,50" }
                ]
            }
        ]
    },
    laundry: {
        active: true,
        info: `**¿Cómo solicitar el servicio?**
1. Introduce tu ropa sucia en una bolsa.
2. Completa el recibo que encontrarás en tu habitación, indicando las prendas y el servicio que deseas.
3. Deja la bolsa en recepción antes de las 14:00 (Lunes a Domingo).
*La ropa entregada después de esta hora se procesará al día siguiente.*

**Información Adicional:**
• Precios con IVA incluido.
• Necesidades específicas pueden tener coste extra.
• El hotel no se hace responsable de encogida, decoloración o daños en botones/hebillas/cremalleras.`,
        categories: [
            {
                name: "Caballeros / Gentlemen",
                items: [
                    { name: "Camisa / Shirt", priceWash: "5,00", priceIron: "4,00" },
                    { name: "Camiseta / Polo", priceWash: "4,50", priceIron: "3,50" },
                    { name: "Chaqueta / Jacket", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Jersey / Pullover", priceWash: "6,00", priceIron: "5,00" },
                    { name: "Pantalón / Trousers", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Pantalón Corto / Shorts", priceWash: "4,00", priceIron: "3,00" },
                    { name: "Corbata / Tie", priceWash: "4,00", priceIron: "2,00" },
                    { name: "Ropa Interior / Underwear", priceWash: "2,00", priceIron: "N/A" },
                    { name: "Calcetines / Socks", priceWash: "2,00", priceIron: "N/A" },
                    { name: "Pijama / Pyjamas", priceWash: "5,00", priceIron: "3,00" }
                ]
            },
            {
                name: "Señoras / Ladies",
                items: [
                    { name: "Blusa / Camisa", priceWash: "5,00", priceIron: "4,00" },
                    { name: "Camiseta / Polo", priceWash: "4,50", priceIron: "3,50" },
                    { name: "Chaqueta / Jacket", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Falda / Skirt", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Falda Plisada / Pleated", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Pantalón / Trousers", priceWash: "7,00", priceIron: "5,00" },
                    { name: "Pantalón Corto / Shorts", priceWash: "4,00", priceIron: "3,00" },
                    { name: "Mono / Jumpsuit", priceWash: "7,00", priceIron: "7,00" },
                    { name: "Vestido / Dress", priceWash: "CONSULTAR", priceIron: "7,00" },
                    { name: "Vestido Fiesta / Evening", priceWash: "CONSULTAR", priceIron: "7,00" },
                    { name: "Ropa Interior / Panties", priceWash: "2,00", priceIron: "N/A" },
                    { name: "Sostén / Bra", priceWash: "2,00", priceIron: "N/A" },
                    { name: "Camisón / Night Dress", priceWash: "5,00", priceIron: "3,00" },
                    { name: "Pijama / Pyjamas", priceWash: "5,00", priceIron: "3,00" }
                ]
            },
            {
                name: "Niños / Children",
                items: [
                    { name: "Camisa / Shirt", priceWash: "5,00", priceIron: "4,00" },
                    { name: "Camiseta / Polo", priceWash: "4,50", priceIron: "3,50" },
                    { name: "Jersey / Pullover", priceWash: "6,00", priceIron: "5,00" },
                    { name: "Calcetines / Socks", priceWash: "2,00", priceIron: "N/A" },
                    { name: "Falda / Skirt", priceWash: "5,00", priceIron: "4,00" },
                    { name: "Pantalón / Trousers", priceWash: "6,00", priceIron: "5,00" },
                    { name: "Vestido / Dress", priceWash: "CONSULTAR", priceIron: "5,00" },
                    { name: "Ropa Interior / Underwear", priceWash: "4,00", priceIron: "N/A" },
                    { name: "Pijama / Pyjamas", priceWash: "4,00", priceIron: "3,00" }
                ]
            }
        ]
    },
    spa: {
        active: true,
        headerImage: "Imagenes/spa.jpg",
        videoUrl: "https://www.youtube.com/embed/lE6RYpe9IT0?rel=0&modestbranding=1",
        images: [],
        prices: {
            week: "12",
            weekend: "18",
            cap: "3",
            flipflops: "1.50"
        }
    },
    info: {
        active: true,
        reception: {
            phone: "1198 / 1199",
            text: "Nuestra recepción está disponible para ayudarte en cualquier momento. Estamos abiertos las 24 horas del día. Nos encontrarás en la Planta Baja (B)."
        },
        breakfast: {
            schedule_week: "07:45 - 11:00",
            schedule_weekend: "08:00 - 11:00",
            price: "8,70",
            location: "Planta SS"
        },
        pool: {
            text: "Exterior. Verano. De junio a septiembre.",
            schedule: "10:00 - 21:00"
        },
        gym: {
            text: "Acceso gratuito a zona de máquinas. Clases colectivas consultar en recepción.",
            schedule_week: "08:00 - 22:00",
            schedule_weekend: "10:00 - 22:00 / 10:00 - 15:00 (Dom)",
            location: "Planta S1"
        },
        parking: {
            text: "Gratis 1 plaza por habitación. Plazas adicionales 7,70€/noche.",
            location: "Planta S1"
        },
        roomService: {
            schedule: "13:30 - 15:00 / 21:00 - 22:30",
            phone: "1181"
        },
        cafeteria: {
            schedule: "07:00 - 11:30 / 13:00 - 16:30 / 19:00 - 00:00",
            location: "Planta SS"
        },
        restaurant: {
            schedule_lunch: "13:30 - 16:00 (Lun-Dom)",
            schedule_dinner: "20:00 - 23:00 (Lun-Sab)",
            location: "Planta SS"
        },
        spa: {
            schedule_week: "10:00 - 22:00",
            schedule_weekend: "10:00 - 15:00 (Dom)",
            phone: "1183",
            location: "Planta S1"
        }
    },
    tourism: {
        active: true,
        desc: "En Cumbria Spa & Hotel, su refugio de relax y bienestar en plena naturaleza, queremos invitarle a una experiencia inolvidable en uno de los espacios naturales más impresionantes de España: el Parque Nacional de Cabañeros, un paraíso silvestre situado entre las provincias de Ciudad Real y Toledo.\n\nAdemás, le invitamos a descubrir la riqueza cultural de Almagro y nuestro propio Teatro Quijano.",
        videoUrl: "https://www.youtube.com/embed/lE6RYpe9IT0?rel=0&modestbranding=1",
        videoUrlPromo: "https://www.youtube.com/embed/40fgsb3EbrE?list=PLCvAsDau1uLP8E-YGMIV3asYjlwlw5uV2",
        coverImage: "https://github.com/CumbriaSpahotel/Servicios/blob/main/Imagenes/CIUDAD%20REAL%20GIGANTES,%20CASTILLOS%20Y%20NATURALEZA.png?raw=true",
        excursions: [
            {
                id: "almagro",
                active: true,
                title: "Almagro",
                subtitle: "Joya Manchega",
                image: "Imagenes/plaza mayor de almagro.jpg",
                heroImage: "Imagenes/plaza mayor de almagro.jpg",
                description: "Historia viva, teatro clásico y gastronomía única en un entorno monumental.",
                fullDesc: "Almagro es una ciudad declarada Conjunto Histórico-Artístico, conocida por su impresionante Corral de Comedias, uno de los teatros al aire libre más antiguos de Europa, construido en el siglo XVII.\n\nAdemás de su legado teatral, Almagro destaca por sus calles empedradas, sus edificios renacentistas y barrocos, y su atmósfera tranquila.\n\nLa Plaza Mayor: El corazón de la villa, única por sus galerías acristaladas.",
                type: "Destino Cultura",
                color: "amber",
                gallery: [
                    "Imagenes/plaza mayor de almagro.jpg",
                    "Imagenes/ALMAGRO VISITA GUIADA.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Almagro_-_Plaza_Mayor_001.jpg/1024px-Almagro_-_Plaza_Mayor_001.jpg"
                ],
                videoUrl: "",
                linkUrl: "https://www.google.com/maps/search/Plaza+Mayor+Almagro"
            },
            {
                id: "cabaneros",
                active: true,
                title: "Parque Nacional de Cabañeros",
                subtitle: "La Sabana Europea",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Parque_Nacional_de_Caba%C3%B1eros.jpg/320px-Parque_Nacional_de_Caba%C3%B1eros.jpg",
                heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Parque_Nacional_de_Caba%C3%B1eros.jpg/1280px-Parque_Nacional_de_Caba%C3%B1eros.jpg",
                description: "Un paraíso silvestre y refugio de fauna única.",
                fullDesc: "En Cumbria Spa & Hotel, su refugio de relax y bienestar en plena naturaleza, queremos invitarle a una experiencia inolvidable en uno de los espacios naturales más impresionantes de España.\n\n¿Qué es Cabañeros?\nEl Parque Nacional de Cabañeros es un santuario natural que abarca más de 38.000 hectáreas de bosques mediterráneos, prados, ríos y montañas. Este ecosistema único alberga una increíble biodiversidad y se considera la \"sabana europea\", debido a sus paisajes ondulados y su flora característica.\n\nEste parque no solo es un lugar de belleza escénica, sino también un refugio vital para especies amenazadas como el lince ibérico, el urogallo cantábrico y el águila imperial ibérica. Además, forma parte de la Red Natura 2000 y ha sido reconocido por la UNESCO como Reserva de la Biosfera.\n\nPor qué visitarlo:\n- Belleza salvaje: Disfrute de paisajes espectaculares que combinan bosques densos, valles profundos y altiplanos soleados.\n- Fauna única: Hogar de especies emblemáticas como el lince ibérico, el ciervo, el jabalí y el zorro. Ideal para observar aves rapaces.\n- Senderismo y actividades: Explore numerosas rutas señalizadas, ciclismo o safaris fotográficos guiados.\n- Centros de interpretación: Aprenda sobre historia y ecología en los centros de información del parque.",
                type: "Naturaleza",
                color: "emerald",
                gallery: [
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Parque_Nacional_de_Caba%C3%B1eros.jpg/1280px-Parque_Nacional_de_Caba%C3%B1eros.jpg"
                ],
                videoUrl: "https://www.youtube.com/embed/VGdxHj-Mxoc",
                linkUrl: "https://www.miteco.gob.es/es/red-parques-nacionales/nuestros-parques/cabaneros.html"
            },
            {
                id: "teatro-quijano",
                active: true,
                title: "Teatro Municipal Quijano",
                subtitle: "El corazón cultural de Ciudad Real",
                image: "Imagenes/Logo-Qijano.png",
                heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ciudad_Real_-_Teatro_Cervantes_-_fachada.jpg/1280px-Ciudad_Real_-_Teatro_Cervantes_-_fachada.jpg",
                description: "Escenario principal de la cultura. Teatro, danza y música en el centro de la ciudad.",
                fullDesc: "El Teatro Municipal Quijano es el epicentro de las artes escénicas en Ciudad Real. Situado en el corazón de la ciudad, junto al Parque de Gasset, este emblemático edificio es el hogar de la cultura, acogiendo desde grandes producciones teatrales hasta conciertos íntimos, ópera y danza contemporánea.\n\nInstalaciones y Aforo:\n- Patio de Butacas: 535 localidades con excelente visibilidad y acústica renovada.\n- Anfiteatro: 371 butacas que ofrecen una perspectiva panorámica única del escenario.\n- Capacidad Total: 906 espectadores disfrutando del arte en vivo.\n\nHistoria y Arquitectura:\nInaugurado como referente cultural, el edificio destaca por su fachada singular y su interior acogedor, diseñado para maximizar la experiencia del espectador. Es el escenario habitual de la prestigiosa Muestra de Teatro Contemporáneo y del Festival de Cortometrajes de Ciudad Real.\n\nProgramación:\nCada temporada, el telón se alza para ofrecer una agenda vibrante que incluye estrenos nacionales, humor, espectáculos infantiles y conciertos de la orquesta filarmónica. Es, sin duda, una parada obligatoria para quienes buscan enriquecer su visita con experiencias culturales auténticas.",
                type: "Cultura",
                color: "rose",
                gallery: [
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ciudad_Real_-_Teatro_Cervantes_-_fachada.jpg/1280px-Ciudad_Real_-_Teatro_Cervantes_-_fachada.jpg",
                    "Imagenes/Logo-Qijano.png"
                ],
                videoUrl: "",
                linkUrl: "https://teatroquijano.com/proximos-estrenos/"
            }
        ]
    }
};

let app = null;
let db = null;

const DB = {
    // Initialize Firebase
    init: (config = null) => {
        // Prefer passed config, then global, then error
        const cfg = config || window.firebaseConfig;

        if (!cfg) {
            console.warn("Firebase config not found.");
            return;
        }

        if (!app) {
            try {
                app = initializeApp(cfg);
                db = getFirestore(app);
                console.log("🔥 Firestore Initialized (v9 Modular)");
            } catch (e) {
                console.error("Error initializing Firebase:", e);
            }
        }
    },

    // Load data (Async)
    get: async () => {
        DB.init();

        if (!db) {
            console.warn("Using LocalStorage Fallback (No Firebase)");
            const stored = localStorage.getItem(DB_KEY);
            return DB.mergeDefaults(stored ? JSON.parse(stored) : null);
        }

        try {
            const docRef = doc(db, DB_COLLECTION, 'cumbria', 'services', 'general');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("✅ Data loaded from Firestore");
                return DB.mergeDefaults(docSnap.data());
            } else {
                console.log("ℹ️ No remote data found, checking local...");
                const stored = localStorage.getItem(DB_KEY);
                let dataToUpload;

                if (stored) {
                    console.log("⬆️ Uploading LOCAL data to Cloud (First sync)");
                    dataToUpload = JSON.parse(stored);
                } else {
                    console.log("✨ Creating defaults for Cloud");
                    dataToUpload = JSON.parse(JSON.stringify(DEFAULT_DATA));
                }

                dataToUpload = DB.mergeDefaults(dataToUpload);
                await setDoc(docRef, dataToUpload);
                return dataToUpload;
            }
        } catch (error) {
            console.error("Error loading from Firestore:", error);
            const stored = localStorage.getItem(DB_KEY);
            return DB.mergeDefaults(stored ? JSON.parse(stored) : null);
        }
    },

    // Save data (Async)
    save: async (data) => {
        DB.init();
        localStorage.setItem(DB_KEY, JSON.stringify(data));

        if (!db) {
            alert("Guardado en LOCAL. \u26A0\uFE0F CLAVES NO CONFIGURADAS O ERROR DE CONEXIÓN.");
            return;
        }

        try {
            const docRef = doc(db, DB_COLLECTION, 'cumbria', 'services', 'general');
            await setDoc(docRef, data);
            console.log("✅ Data saved to Firestore");
        } catch (error) {
            console.error("Error saving to Firestore:", error);
            throw error;
        }
    },

    // Save Menu History
    saveMenuHistory: async (menuData) => {
        DB.init();
        if (!db) return;

        try {
            const historyRef = collection(db, DB_COLLECTION, 'cumbria', HISTORY_COLLECTION);
            await addDoc(historyRef, {
                ...menuData,
                savedAt: serverTimestamp()
            });
            console.log("📜 Menu history saved");
        } catch (e) {
            console.error("Error saving menu history:", e);
            // Don't throw, failing history shouldn't block main save
        }
    },

    // Helper to merge old data with new structure defaults
    mergeDefaults: (data) => {
        if (!data) return JSON.parse(JSON.stringify(DEFAULT_DATA));
        // Simple merge logic
        for (const key in DEFAULT_DATA) {
            if (data[key] === undefined) {
                data[key] = DEFAULT_DATA[key];
            } else if (typeof DEFAULT_DATA[key] === 'object' && DEFAULT_DATA[key] !== null) {
                // Shallow merge 2nd level for safety
                for (const subKey in DEFAULT_DATA[key]) {
                    if (data[key][subKey] === undefined) {
                        data[key][subKey] = DEFAULT_DATA[key][subKey];
                    }
                }
            }
        }
        return data;
    },

    reset: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
};

// Make it global for admin.html to use, AND export it for module usage
window.DB = DB;
export { DB };
