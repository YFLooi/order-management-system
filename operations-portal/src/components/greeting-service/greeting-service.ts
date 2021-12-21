import { Subject } from "rxjs";

// Declaring the observable like this allows it to be imported
// wherever it should be subscribed to
export default class GreetingService {
  subject: Subject<unknown>;

  constructor() {
    this.subject = new Subject();
  }

  // emit new greetings as they are produced by CreateGreeting.sendGreeting
  emit(value: string) {
    this.subject.next(value);
  }

  // exposes the Observable part of the Subject
  greetings() {
    return this.subject.asObservable();
  }
}
