import React from "react"

interface DynamicPageProps {
    page: number;
}

export const DynamicPageContent: React.FC<DynamicPageProps> = ({page}) => {
    let pageIDString;
    if (page === 0) pageIDString = 'body-dyn-game';
    else if (page === 1) pageIDString = 'body-dyn-rules';
    else if (page === 2) pageIDString = 'body-dyn-about';
    return (
        <div id={pageIDString}>

        </div>
    )
}