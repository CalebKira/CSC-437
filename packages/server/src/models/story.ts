

export interface Story {
    storyid: string;
    /* specified id to make every story unique and accessible */
    userid: string;
    /* owner id */
    category: string;
    content: string;
    /* make content into a schema to hold the kind of category story */
}