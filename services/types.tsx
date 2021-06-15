export interface HomePageInfoI {
    title: string;
    description: string;
    banner: string;
    head: string;
}

export interface WarningI {
    message: string;
    input: string;
    type: "error" | "success" | "warnings";
}

export interface PostCardI {
    image: string;
    link: string;
    title: string;
    description: string;
}

export interface PagesInfoI {
    websiteName: string;
    description: string;
    keywords: string;
    icon: string;
    colors: {
        background: {
            shadow: string,
            color: string
        },
        text: {
            shadow: string,
            color: string
        }
    };
    customLayoutStyles: string;
    customLayout: {
        colors: {
            background: {
                shadow: string,
                color: string
            },
            text: {
                shadow: string,
                color: string
            }
        }
    };
}