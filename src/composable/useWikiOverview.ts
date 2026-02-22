import { ref, inject, provide, type InjectionKey, type Ref } from "vue";


export type WikiPanelState = {
    searchKeyword: Ref<string>
    selectedId: Ref<Set<string>>
}

const WikiPanelKey: InjectionKey<WikiPanelState> = Symbol("WikiPanelState")

export function provideWikiPanelState() {
    const searchKeyword = ref("")
    const selectedId = ref(new Set<string>())

    const state: WikiPanelState = {
        searchKeyword,
        selectedId
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