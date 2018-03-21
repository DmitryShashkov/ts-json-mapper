/**
 * Interface that describes correspondence between
 * fields in JSON and in TS model.
 */
export interface Correspondence {
    // name of the field in JSON
    readonly jsonField: string;

    // name of the field in TS model
    readonly modelField: string;

    // type of the field in TS model
    readonly type: any;
}