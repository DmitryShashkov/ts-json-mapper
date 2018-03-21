/**
 * Interface that describes correspondence between
 * fields in JSON and in TS model.
 */
export interface Correspondence {
    readonly jsonField: string;
    readonly modelField: string;
    readonly type: any;
}
