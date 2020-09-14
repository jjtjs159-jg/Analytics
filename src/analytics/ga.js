import ReactGA from 'react-ga';

const id = process.env.GA_ID;
const ga = {
    initGA: () => {
        if (!id) {
            return;
        }
        ReactGA.initialize(process.env.GA_ID);
    },
    logPageView: (current) => {
        if (!id) {
            return;
        }
        const currentPage = current || window.location.pathname;
        ReactGA.set({ page: currentPage });
        ReactGA.pageview(currentPage);
    },
    logEvent: (category = '', action = '') => {
        if (!id) {
            return;
        }
        if (category && action) {
            ReactGA.event({ category, action });
        }
    },
    logException: (description = '', fatal = false) => {
        if (!id) {
            return;
        }
        if (description) {
            ReactGA.exception({ description, fatal });
        }
    },
};

export default ga;
