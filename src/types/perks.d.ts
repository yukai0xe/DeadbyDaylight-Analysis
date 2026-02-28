export interface Perk {
    id: string;
    name: Lang;
    description: Lang;
    icon: string;
    character: string;
    characterPortrait: string;
    camp: number;
}

export interface PerkViewModel {
    name: string;
    description: string;
    icon: string;
    character: string;
    characterPortrait: string;
    camp: number;
}

export interface Lang {
    "en": string;
    "zh-tw": string;
}