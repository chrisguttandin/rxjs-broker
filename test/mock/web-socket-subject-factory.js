import { Subject } from 'rxjs';

export class WebSocketSubjectFactoryMock {

    constructor () {
        this.create = sinon.spy(this.create); // eslint-disable-line no-undef
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
