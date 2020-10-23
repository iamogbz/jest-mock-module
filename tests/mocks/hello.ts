export function say(what: string, who: string): string {
    return `${what} ${who}`;
}

export function shout(what: string): string {
    return `${what.toLocaleUpperCase()}!`;
}
