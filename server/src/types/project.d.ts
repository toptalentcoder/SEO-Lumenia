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
    }>
}

type KeywordCounts = Record<string, number>;
type KeywordDistributions = KeywordCounts[];