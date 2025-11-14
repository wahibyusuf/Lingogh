
export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    sources?: Source[];
}

export interface Source {
    uri: string;
    title: string;
}

export interface DailyPlanTask {
    id: string;
    description: string;
    type: 'listening' | 'speaking' | 'writing' | 'other';
    completed: boolean;
}

export interface DailyPlan {
    date: string;
    tasks: DailyPlanTask[];
}
