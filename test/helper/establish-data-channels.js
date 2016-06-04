/* eslint-disable indent */
const ICE_SERVERS = [{
          url: 'stun:stun.l.google.com:19302'
      }, {
          url: 'stun:stun1.l.google.com:19302'
      }, {
          url: 'stun:stun2.l.google.com:19302'
      }, {
          url: 'stun:stun3.l.google.com:19302'
      }, {
          url: 'stun:stun4.l.google.com:19302'
      }];
/* eslint-enable indent */

/* eslint-disable no-undef */
if (!('RTCPeerConnection' in window) && ('webkitRTCPeerConnection' in window)) {
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
}
/* eslint-enable no-undef */

export const establishDataChannels = () => {
    return new Promise((resolve, reject) => {
        var localDataChannel,
            localPeerConnection,
            remoteDataChannel,
            remoteDataChannelIsOpen = false,
            remotePeerConnection;

        localPeerConnection = new RTCPeerConnection({ // eslint-disable-line no-undef
            iceServers: ICE_SERVERS
        });

        remotePeerConnection = new RTCPeerConnection({ // eslint-disable-line no-undef
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

        remoteDataChannel = remotePeerConnection.createDataChannel('channel');

        remoteDataChannel.onerror = (event) => reject(event.error);

        remoteDataChannel.onopen = () => {
            remoteDataChannelIsOpen = true;

            if (localDataChannel) {
                resolve({ localDataChannel, remoteDataChannel });
            }
        };

        remotePeerConnection.createOffer((description) => {
            remotePeerConnection.setLocalDescription(description);

            localPeerConnection.setRemoteDescription(description);
            localPeerConnection.createAnswer((description) => {
                localPeerConnection.setLocalDescription(description);

                remotePeerConnection.setRemoteDescription(description);
            }, (err) => reject(err));
        }, (err) => reject(err));
    });
};
