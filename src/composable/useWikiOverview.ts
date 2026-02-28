import { ref, inject, provide, type InjectionKey, type Ref } from "vue";
import type { Option } from "@/types/components";

export type WikiPanelState = {
    searchKeyword: Ref<string>
    selectedId: Ref<Set<string>>
    selectedLang: Ref<string>
    langOptions: Option[]
}

const WikiPanelKey: InjectionKey<WikiPanelState> = Symbol("WikiPanelState")

export function provideWikiPanelState() {
    const searchKeyword = ref("")
    const selectedId = ref(new Set<string>())
    const selectedLang = ref<string>("en");
    const langOptions: Option[] = [
        { label: "English", value: "en", children: [] },
        { label: "Chinese", value: "zh-tw", children: [] }
    ]
    
    const state: WikiPanelState = {
        searchKeyword,
        selectedId,
        selectedLang,
        langOptions
    }

    provide(WikiPanelKey, state)
    return state
}

export function useWikiPanelState() {
    const state = inject(WikiPanelKey)
    if (!state) {
        throw new Error("useWikiPanelState must be used under provideWikiPanelState()")
    }
    return state
}