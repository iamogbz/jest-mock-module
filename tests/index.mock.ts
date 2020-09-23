export function say(what: string, who: string): string {
    return `${what} ${who}`;
}

export function shout(what: string): string {
    return `${what.toLocaleUpperCase()}!`;
}

export default function sayHello(who: string): string {
    return shout(say("Hello", who));
}
