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
import { createSeoGuide } from "./seoGuide/createSeoGuide";
import { generateSeoAutoEndpoint } from "./seoGuide/generateSeoAutoEndpoint";
import { generateSeoOutlineEndpoint } from "./seoGuide/generateSeoOutlineEndpoint";
import { generateSeoQuestionsEndpoint } from "./seoGuide/generateSeoQuestions";
import { generateSeoRephraseEndpoint } from "./seoGuide/generateSeoRephraseEndpoint";
import { createSocialPostEndpoint } from "./seoGuide/createSocialPostEndpoint";
import { calculateOptimizationLevels } from "./seoGuide/calculateOptimizationLevels";
import { verifySeoBriefEndpoint } from "./seoGuide/verifySeoBriefEndpoint";
import { getSeoEditorDataEndpoint } from "./seoGuide/getSeoEditor";
import { getSocialPostEndpoint } from "./seoGuide/getSocialPost";
import { generateWebpageTitleMetaEndpoint } from "./seoGuide/generateWebpageTitleMeta";
import { getWebpageTitleMetaEndpoint } from "./seoGuide/getWebpageTitleMeta";
import { getCronjobData } from "./getCronjobData";
import { getMonitoringUrl } from "./seoGuide/monitoring/getMonitoring";
import { setMonitoringUrl } from "./seoGuide/monitoring/setMonitoring";
import { getUserProjectList } from "./projectManagement/getProjectList";
import { getProjectGuides } from "./projectManagement/getProjectByProjectID";
import { saveSeoEditorDataEndpoint } from "./seoGuide/saveSeoEditorDataEndpoint";
import { translateSeoEditorEndpoint } from "./seoGuide/translateSeoEditorEndpoint";
import { generateSeoCategoryEndpoint } from "./seoGuide/generateSeoCategoryEndpoint";
import { saveOptimizationGraphDataEndpoint } from "./seoGuide/saveGraphdDataEndpoint";
import { getOptimizationGraphDataEndpoint } from "./seoGuide/getGraphDataEndpoint";
import { calculateSoseoDseoEndpoint } from "./seoGuide/calculateSoseoAndDseoEndpoint";

export const customEndpoints = [
    googleAuthEndpoint,
    getPlansFromDbEndpoint,
    paypalSubscriptionEndpoint,
    showSubscriptionEndpoint,
    saveSubscriptionToUserCollection,
    getUserDataForRefreshPageEndpoint,
    addProjectToUser,
    getUserProjectInfo,
    getUserProjects,
    getUserProjectList,
    getProjectGuides,
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
    calculateSoseoDseoEndpoint
]