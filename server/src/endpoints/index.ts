import { googleAuthEndpoint } from "./auth/googleAuthEndpoint";
import { getUserDataForRefreshPageEndpoint } from "./getUserDataForRefreshPageEndpoint";
import { paypalSubscriptionEndpoint } from "./paypal/createSubscriptionEndpoint";
import { getPlansFromDbEndpoint } from "./paypal/getPlansFromDbEndpoint";
import { saveSubscriptionToUserCollection } from "./paypal/saveSubscriptionTpDbEndpoint";
import { showSubscriptionEndpoint } from "./paypal/showSubscriptionEndpoint";
import { getUserProjects } from "./projectManagement/getProject";
import { getUserProjectInfo } from "./projectManagement/getProjectInfo";
import { getSeoGuideByQueryID } from "./projectManagement/getSeoGuideByQueryID";
import { addProjectToUser } from "./projectManagement/postProject";
import { editProject } from "./projectManagement/editProject";
import { deleteProject } from "./projectManagement/deleteProject";
import { generateSeoAutoEndpoint } from "./seoGuide/seoEditor/generateSeoAutoEndpoint";
import { generateSeoOutlineEndpoint } from "./seoGuide/seoEditor/generateSeoOutlineEndpoint";
import { generateSeoQuestionsEndpoint } from "./seoGuide/seoEditor/generateSeoQuestions";
import { generateSeoRephraseEndpoint } from "./seoGuide/seoEditor/generateSeoRephraseEndpoint";
import { createSocialPostEndpoint } from "./seoGuide/createSocialPostEndpoint";
import { calculateOptimizationLevels } from "./seoGuide/calculateOptimizationLevels";
import { verifySeoBriefEndpoint } from "./seoGuide/verifySeoBriefEndpoint";
import { getSeoEditorDataEndpoint } from "./seoGuide/seoEditor/getSeoEditor";
import { getSocialPostEndpoint } from "./seoGuide/getSocialPost";
import { generateWebpageTitleMetaEndpoint } from "./seoGuide/generateWebpageTitleMeta";
import { getWebpageTitleMetaEndpoint } from "./seoGuide/getWebpageTitleMeta";
import { getCronjobData } from "./getCronjobData";
import { getMonitoringUrl } from "./seoGuide/monitoring/getMonitoring";
import { setMonitoringUrl } from "./seoGuide/monitoring/setMonitoring";
import { getUserProjectList } from "./projectManagement/getProjectList";
import { getProjectGuides } from "./projectManagement/getProjectByProjectID";
import { saveSeoEditorDataEndpoint } from "./seoGuide/seoEditor/saveSeoEditorDataEndpoint";
import { translateSeoEditorEndpoint } from "./seoGuide/translateSeoEditorEndpoint";
import { generateSeoCategoryEndpoint } from "./seoGuide/generateSeoCategoryEndpoint";
import { saveOptimizationGraphDataEndpoint } from "./seoGuide/saveGraphdDataEndpoint";
import { getOptimizationGraphDataEndpoint } from "./seoGuide/getGraphDataEndpoint";
import { calculateSoseoDseoEndpoint } from "./seoGuide/soseo_dseo/calculateSoseoAndDseoEndpoint";
import { saveSoseoDseoEndpoint } from "./seoGuide/soseo_dseo/save_soseo_dseo";
import { getSoseoDseoEndpoint } from "./seoGuide/soseo_dseo/get_soseo_dseo";
import { generateKeywordsEndpoint } from "./serpWeather/generateKeywordsEndpoint";
import { getMonitoringData } from "./seoGuide/monitoring/getMonitoringData";
import { getAllUserProjects } from "./projectManagement/getAllUserProject";
import { internalPageRankEndpoint } from "./internal_page_rank/internalPageRankEndpoint";
import { getInternalPageRankEndpoint } from "./internal_page_rank/getInternalPageRankEndpoint";
import { pageDuplicationEndpoint } from "./page_duplication/pageDuplicationEndpoint";
import { getSerpWeatherDataEndpoint } from "./serpWeather/getSerpWeatherDataEndpoint";
import { trackKeywordsEndpoint } from "./serpWeather/trackKeywordsEndpoint";
import { getHistoricalVolatilityEndpoint } from "./serpWeather/getHistoricalVolatilityEndpoint";
import { addTestDataEndpoint } from "./serpWeather/addTestDataEndpoint";
import { deleteQueryEndpoint } from "./seoGuide/deleteQuery";
import { backlinksOverviewEndpoint } from "./backlinks_overview/backlinksOverview";
import { userBacklinkHistoryEndpoint } from "./backlinks_overview/userBacklinkHistory";
import { searchBacklinksEndpoint } from "./backlinks_overview/searchBacklinks";
<<<<<<< HEAD
import { saveKeywordsForSERPWeatherCategoryEndpoint } from "./saveKeywordsForSerpWeatherEndpoint";
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { getProgressEndpoint } from "./seoGuide/getProgress";
import { createSeoGuide } from "./seoGuide/createSeoGuide";
import { getPageDuplicationEndpoint } from "./page_duplication/getPageDuplicationEndpoint";
import { getNumberOf25TopKeywordsEndpoint } from "./getNumberOf25TopKeywordsEndpoint";
import { getNumberOfBacklinksEndpoint } from "./getNumberOfBacklinksEndpoint";
<<<<<<< HEAD
=======
import { getSeoGuideStatus } from './seoGuide/getSeoGuideStatus';
import { getSeoBriefStatus } from './seoGuide/getSeoBriefStatus';
import { intercomSign } from "./intercom-sign";
import { generateBrainstormerIdeasEndpoint } from "./contentStrategy/generateIdes/generateBrainstormerIdeas";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

export const customEndpoints = [
    googleAuthEndpoint,
    getPlansFromDbEndpoint,
    paypalSubscriptionEndpoint,
    showSubscriptionEndpoint,
    saveSubscriptionToUserCollection,
    getUserDataForRefreshPageEndpoint,
    addProjectToUser,
    editProject,
    deleteProject,
    getUserProjectInfo,
    getUserProjects,
    getUserProjectList,
    getProjectGuides,
    getAllUserProjects,
    getSeoGuideByQueryID,
    generateSeoQuestionsEndpoint,
    generateSeoOutlineEndpoint,
    generateSeoAutoEndpoint,
    generateSeoRephraseEndpoint,
    saveSeoEditorDataEndpoint,
    translateSeoEditorEndpoint,
    createSeoGuide,
    createSocialPostEndpoint,
    calculateOptimizationLevels,
    verifySeoBriefEndpoint,
    getSeoEditorDataEndpoint,
    getSocialPostEndpoint,
    generateWebpageTitleMetaEndpoint,
    getWebpageTitleMetaEndpoint,
    getCronjobData,
    getMonitoringUrl,
    setMonitoringUrl,
    generateSeoCategoryEndpoint,
    saveOptimizationGraphDataEndpoint,
    getOptimizationGraphDataEndpoint,
    calculateSoseoDseoEndpoint,
    saveSoseoDseoEndpoint,
    getSoseoDseoEndpoint,
    generateKeywordsEndpoint,
    getMonitoringData,
    internalPageRankEndpoint,
    getInternalPageRankEndpoint,
<<<<<<< HEAD
    saveKeywordsForSERPWeatherCategoryEndpoint,
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
    pageDuplicationEndpoint,
    getSerpWeatherDataEndpoint,
    trackKeywordsEndpoint,
    getHistoricalVolatilityEndpoint,
    addTestDataEndpoint,
    deleteQueryEndpoint,
    backlinksOverviewEndpoint,
    userBacklinkHistoryEndpoint,
    searchBacklinksEndpoint,
    getProgressEndpoint,
    getInternalPageRankEndpoint,
    getPageDuplicationEndpoint,
    getNumberOf25TopKeywordsEndpoint,
<<<<<<< HEAD
    getNumberOfBacklinksEndpoint
=======
    getNumberOfBacklinksEndpoint,
    getSeoGuideStatus,
    getSeoBriefStatus,
    getUserDataForRefreshPageEndpoint,
    intercomSign,
    generateBrainstormerIdeasEndpoint
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
]