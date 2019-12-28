const ICE_SERVERS = [ {
    urls: [
        'stun:stun.l.google.com:19302',
        'stun:global.stun.twilio.com:3478?transport=udp'
    ]
} ];

export const establishDataChannels = () => {
    return new Promise((resolve, reject) => {
        let localDataChannel;
        let remoteDataChannelIsOpen = false;

        const localPeerConnection = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });
        const remotePeerConnection = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });

        localPeerConnection.ondatachannel = ({ channel }) => {
            localDataChannel = channel;

            if (remoteDataChannelIsOpen) {
                resolve({ localDataChannel, remoteDataChannel });
            }
        };

        localPeerConnection.onerror = (event) => reject(event.error);

        localPeerConnection.onicecandidate = ({ candidate }) => remotePeerConnection.addIceCandidate(candidate, () => {}, (err) => reject(err));

        remotePeerConnection.onerror = (event) => reject(event.error);

        remotePeerConnection.onicecandidate = ({ candidate }) => localPeerConnection.addIceCandidate(candidate, () => {}, (err) => reject(err));

        const remoteDataChannel = remotePeerConnection.createDataChannel('channel');

        remoteDataChannel.onerror = (event) => reject(event.error);

        remoteDataChannel.onopen = () => {
            remoteDataChannelIsOpen = true;

            if (localDataChannel) {
                resolve({ localDataChannel, remoteDataChannel });
            }
        };

        remotePeerConnection.createOffer((offerDescription) => {
            remotePeerConnection.setLocalDescription(offerDescription);

            localPeerConnection.setRemoteDescription(offerDescription);
            localPeerConnection.createAnswer((answerDescription) => {
                localPeerConnection.setLocalDescription(answerDescription);

                remotePeerConnection.setRemoteDescription(answerDescription);
            }, (err) => reject(err));
        }, (err) => reject(err));
    });
};
