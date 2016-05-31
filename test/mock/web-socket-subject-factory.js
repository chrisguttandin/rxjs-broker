import { Subject } from 'rxjs/Subject';
import { spy } from 'sinon';

export class WebSocketSubjectFactoryMock {

    constructor () {
        this.create = spy(this.create);
        this._webSocketSubjects = [];
    }

    get webSocketSubjects () {
        return this._webSocketSubjects;
    }

    create () {
        const webSocketSubject = new Subject();

        this._webSocketSubjects.push(webSocketSubject);

        return webSocketSubject;
    }

}
