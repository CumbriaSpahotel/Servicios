/**
 * db.js
 * Handles data persistence for Cumbria Guest Portal
 * Uses localStorage to sync between Admin and Guest View
 */

const DB_KEY = 'cumbria_hotel_data_v1';

const DEFAULT_DATA = {
    restaurante: {
        title: "Restaurante Cumbria",
        desc: "Cocina de mercado con productos de la tierra.",
        schedule: "13:30 - 16:00 / 20:00 - 23:00 (Dom. Noche Cerrado)",
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
        items: [
            { name: "Camisa / Blusa", price: "6.00" },
            { name: "Pantalón", price: "7.00" },
            { name: "Traje Completo", price: "14.00" },
            { name: "Ropa Interior", price: "2.50" }
        ]
    },
    spa: {
        prices: {
            week: "12",
            weekend: "18",
            cap: "3",
            flipflops: "1.50"
        }
    },
    info: {
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
        videoUrl: "https://www.youtube.com/embed/MOKuKw_1tEQ"
    }
};

const DB = {
    // Load data from localStorage or return default
    get: () => {
        const stored = localStorage.getItem(DB_KEY);
        let data = stored ? JSON.parse(stored) : null;

        if (!data) {
            // Initialize if new
            data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            localStorage.setItem(DB_KEY, JSON.stringify(data));
        } else {
            // Merge missing top-level keys from DEFAULT_DATA
            // This ensures new features (like tourism, info) appear in old datasets
            let updated = false;
            for (const key in DEFAULT_DATA) {
                if (data[key] === undefined) {
                    data[key] = DEFAULT_DATA[key];
                    updated = true;
                }
            }
            // Force update Laundry structure if it's the old simple format but we need detailed
            if (data.laundry && !data.laundry.categories && DEFAULT_DATA.laundry.categories) {
                data.laundry = DEFAULT_DATA.laundry;
                updated = true;
            }

            if (updated) {
                localStorage.setItem(DB_KEY, JSON.stringify(data));
            }
        }
        return data;
    },

    // Save data object to localStorage
    save: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        // Dispatch event for updating UI in other tabs/windows if needed (not strict requirement but good practice)
        window.dispatchEvent(new Event('storage'));
    },

    // Reset to defaults
    reset: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
    }
};
