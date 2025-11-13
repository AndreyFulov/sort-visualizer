export function calculateNote(note: number) : number {
    return 27.5*(Math.pow(2,note/12));
}