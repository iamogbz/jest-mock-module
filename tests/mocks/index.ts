import { CALL, say, shout } from "./hello";

export default function sayHello(who: string): string {
  return shout(say(CALL, who));
}
