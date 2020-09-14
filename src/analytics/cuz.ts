import ReactGA from 'react-ga';

interface Product {
    // Product ID
    id: string;
    // Product name
    name: string;
    // Product category
    category: string;
    // Product brand
    brand: string; 
    // Product variant
    variant?: string;
    // Product price
    price: number;
    // Product coupon
    coupon?: string;
    // Product quantity
    quantity: number;
}

interface Purchase {
    // (Required) Transaction id
    id: string;
    // Affiliation
    affiliation: string;
    // Revenue - Total Amount (TotalPrice + ShippingFee - tax)
    revenue: number;
    // Tax
    tax?: number;
    // Shipping
    shipping: number;
    // Transaction coupon
    coupon: string;
}

type Cuz = {
    // initialize Google Analytics
    initGA: () => void;
    // initilaize Cuz
    initCuz: () => void;
    // log page view
    pageView: (current: string) => void;
    // send item view
    sendProduct: (product: Product) => void;
    // send checkout
    sendCheckOut: (product: Product) => void;
    // send purchase
    sendPurchase: (product: Product, purchase: Purchase) => void;
}

const GA_ID = process.env.GA_ID;
const SendGoogleAnalytics = true;

const cuz: Cuz = {
    initGA: () => {
        const date: any = new Date();
        
        /**
         * Creates a temporary global ga object and loads analytics.js.
         * Parameters o, a, and m are all used internally. They could have been
         * declared using 'var', instead they are declared as parameters to save
         * 4 bytes ('var ').
         *
         * ISOGRAM
         * @param {Window}        i The global context object.
         * @param {HTMLDocument}  s The DOM document object.
         * @param {string}        o Must be 'script'.
         * @param {string}        g Protocol relative URL of the analytics.js script.
         * @param {string}        r Global name of analytics object. Defaults to 'ga'.
         * @param {HTMLElement}   a Async script tag.
         * @param {HTMLElement}   m First script tag in document.
         */
        (function (i: any, s: any, o: any, g: any, r: any, _a = undefined, _m = undefined) {
            i.GoogleAnalyticsObject = r;
            i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments); };
            i[r].l = 1 * date;
            const a = s.createElement(o);
            const m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(
            window,
            document,
            'script',
            'https://www.google-analytics.com/analytics.js',
            'ga',
        );
    },
    initCuz: () => {
        if (!window.ga) {
            // The create method analytics.js library
            // ReactGA.ga('create', GA_ID, 'auto');
            if (!GA_ID) { return; }

            ReactGA.initialize(GA_ID);
        }

        if (!document.getElementById('cuz_script')) {

            /**
             * Load the Cuz Plugin
             * sendOriginal: false - do not send Google Analytics (prevent duplicate analytics event)
             */
            ReactGA.ga('require', 'cuzPlugIn', { sendOriginal: SendGoogleAnalytics });

            /**
             * Load the Ecommerce Plugin
             * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#loadit
             */
            ReactGA.ga('require', 'ec');

            // Add Cuz Script
            const script = document.createElement('script');
            script.src = 'https://sdk.cuz360.com/v1/cuz360-plugin-min.js';
            script.id = 'cuz_script';
            document.body.appendChild(script);
        }
    },
    pageView: (current: string) => {
        const currentPage = current || window.location.pathname;
        ReactGA.set({ page: currentPage });
        ReactGA.ga('send', 'pageview');
    },
    sendProduct: (product: Product) => {
        const {
            id, name, category, brand, variant, price, coupon, quantity,
        } = product;

        // Provide product details in an productFieldObject
        ReactGA.ga('ec:addProduct', {
            id,
            name,
            category,
            brand, 
            variant,
            price,
            coupon,
            quantity,
        });

        // CUZ360 - Item View
        ReactGA.ga('ec:setAction', 'detail');

        // send
        ReactGA.ga('send', 'event');
    },
    sendCheckOut: (product: Product) => {
        const {
            id, name, category, brand, variant, price, coupon, quantity,
        } = product;

        // Provide product details in an productFieldObject
        ReactGA.ga('ec:addProduct', {
            id,
            name,
            category,
            brand, 
            variant,
            price,
            coupon,
            quantity,
        });

        // CUZ360 - CheckOut
        ReactGA.ga('ec:setAction','checkout', {
            step: 1,
            option: 'Visa',
        });

        // send
        ReactGA.ga('send', 'event', 'Checkout');
    },
    sendPurchase: (product: Product, purchase: Purchase) => {
        const {
            id, name, category, brand, variant, price, coupon: product_coupon, quantity,
        } = product;

        const {
            id: transaction_id, affiliation, revenue, tax, shipping, coupon: purchase_coupon,
        } = purchase;

        // Provide product details in an productFieldObject
        ReactGA.ga('ec:addProduct', {
            id,
            name,
            category,
            brand, 
            variant,
            price,
            coupon: product_coupon,
            quantity,
        });

        // CUZ360 - PurChase
        // Transaction details are provided in an actionFieldObject.
        ReactGA.ga('ec:setAction', 'purchase', {
            id: transaction_id,
            affiliation,
            revenue,
            tax,
            shipping,
            coupon: purchase_coupon,
        });

        // send
        ReactGA.ga('send', 'event');
    }
};

export default cuz;
