// ✅ Define a Project Interface for Type Safety
export interface Project {
    projectID: string;
    projectName : string;
    domainName: string;
    seoGuides: string[] | [];
}
export interface ProjectSeoGuide {
    seoGuides : Array<{
        queryID : string;
        seoEditor : string;
        category : string;
        briefVerification?: {
            verificationResult: {
                objective: boolean;
                mainTopics: string[];
                importantQuestions: string[];
                writingStyleAndTone: string[];
                recommendedStyle: string[];
                valueProposition: string[];
            };
            improvementText: string;
            verifiedAt: string;
        };
    }>
}

export interface ProjectSocialPost {
    seoGuides : Array<{
        queryID : string;
        socialPost : string[];
    }>
}

export interface ProjectWebpageTitleAndMeta {
    seoGuides : Array<{
        queryID : string;
        webpageTitleMeta : string[];
    }>
}

type KeywordCounts = Record<string, number>;
type KeywordDistributions = KeywordCounts[];