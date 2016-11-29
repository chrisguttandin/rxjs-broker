export interface IMaskableSubject {

    close ();

    mask (mask): IMaskableSubject;

    send (message): Promise<any>;

}
