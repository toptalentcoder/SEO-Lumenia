<<<<<<< HEAD
export const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:7777'; 
=======
export const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://lumenia.io'; 
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
    GET_SEO_GUIDE: '/api/getSeoGuideByQueryID',
    SAVE_SEO_EDITOR: '/api/save_seo_editor_data',
    GET_SEO_EDITOR: '/api/get_seo_editor_data',
    VERIFY_SEO_BRIEF: '/api/verify_seo_brief',
    SEO_BRIEF_STATUS: '/api/seoBriefStatus',
    CALCULATE_OPTIMIZATION: '/api/calculate_optimization_levels',
    SAVE_OPTIMIZATION: '/api/save_optimization_graph_data',
    GENERATE_SEO_CATEGORY: '/api/generate_seo_category',
    CALCULATE_SOSEO_DSEO: '/api/calculate_soseo_dseo',
    SAVE_SOSEO_DSEO: '/api/save_soseo_dseo',
    GET_OPTIMIZATION_GRAPH: '/api/get_optimization_graph_data',
    GET_SOSEO_DSEO: '/api/get_soseo_dseo'
};

export const CHART_COLORS = {
    SUB_OPTIMIZED: '#7CB5EC',
    STANDARD_OPTIMIZED: '#90EE7E',
    STRONG_OPTIMIZED: '#FFA500',
    OVER_OPTIMIZED: '#FF0000',
    MAIN_SERIES: '#000000'
};

export const OPTIMIZATION_TYPES = {
    SUB: 'subOptimized',
    STANDARD: 'standardOptimized',
    STRONG: 'strongOptimized',
    OVER: 'overOptimized'
};

export const ERROR_MESSAGES = {
    GUIDE_TOO_SHORT: 'Guide text too short.',
    VERIFICATION_FAILED: 'Verification failed. Please try again.',
    REQUEST_TIMEOUT: 'Request timed out. Please try again.',
    CONNECTION_RESET: 'Connection was reset. Please try again.',
    UNKNOWN_ERROR: 'An error occurred. Please try again.'
};

export const LOADING_TIMEOUT = 300000; // 5 minutes
export const POLLING_INTERVAL = 2000; // 2 seconds
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
