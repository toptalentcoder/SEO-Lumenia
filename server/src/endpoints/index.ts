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
    getSeoGuideByQueryID,
    generateSeoQuestionsEndpoint,
    generateSeoOutlineEndpoint,
    generateSeoAutoEndpoint,
    generateSeoRephraseEndpoint,
    createSeoGuide,
    createSocialPostEndpoint,
    calculateOptimizationLevels
]