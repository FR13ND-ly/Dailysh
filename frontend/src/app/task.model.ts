export interface Task {
    id: string,
    userId: string,
    text: string;
    repeat: number;
    repeatDone: number;
    repeatWeek: string[];
    disabled: boolean
}