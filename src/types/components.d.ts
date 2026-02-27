export interface MarqueeRowType {
    speed: string;
    reverse?: boolean;
}

export interface MarqueeItemType {
    id: string;
    icon: string;
    title?: string;
}

export type NodeState = 'locked' | 'available' | 'purchased' | 'corrupted'

export type BloodNode = {
    id: string
    name: string
    layer: number
    cost: number
    x: number
    y: number
    state: NodeState
}

export type BloodEdge = {
    id: string
    from: string
    to: string
}

export type BloodGraph = {
    nodes: BloodNode[]
    edges: BloodEdge[]
}

interface Option {
    label: string
    value: string | number | null
    children?: Option[]
}