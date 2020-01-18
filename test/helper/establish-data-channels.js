export const establishDataChannels = () => {
    const localPeerConnection = new RTCPeerConnection();
    const remotePeerConnection = new RTCPeerConnection();

    localPeerConnection.onicecandidate = ({ candidate }) => remotePeerConnection.addIceCandidate(candidate);
    remotePeerConnection.onicecandidate = ({ candidate }) => localPeerConnection.addIceCandidate(candidate);

    const localDataChannel = localPeerConnection.createDataChannel('channel', { id: 0, negotiated: true });
    const remoteDataChannel = remotePeerConnection.createDataChannel('channel', { id: 0, negotiated: true });

    remotePeerConnection
        .createOffer()
        .then((offerDescription) => {
            remotePeerConnection.setLocalDescription(offerDescription);
            localPeerConnection.setRemoteDescription(offerDescription);

            return localPeerConnection.createAnswer();
        })
        .then((answerDescription) => {
            localPeerConnection.setLocalDescription(answerDescription);

            remotePeerConnection.setRemoteDescription(answerDescription);
        });

    return { localDataChannel, remoteDataChannel };
};
