export const notificationMixin = {
  data: function () {
    return {
      btnPushDisabled: false,
      btnPushIcon: 'notifications',
      isPushEnabled: false,
      applicationServerKey: 'BLkaLNKUYDbWDT9s6rPaKteSUVsm9RCD7TtfeQ3eWm1B6KzT0-z_sJm4SPHTaLF5o0ZgBB--y-Je6vxUffhpUtY'
    }
  },
  methods: {
    pushButton () {
      if (this.isPushEnabled) {
        this.pushUnsubscribe();
      } else {
        this.pushSubscribe();
      }
    },
    changePushButtonState(state) {
      switch (state) {
        case 'enabled':
        this.btnPushDisabled = false;
        this.btnPushIcon = 'notifications_active';
        // this.$q.notify('As notificações foram ativadas');
        this.isPushEnabled = true;
        break;
        case 'disabled':
        this.btnPushDisabled = false;
        this.btnPushIcon = 'notifications_off';
        this.isPushEnabled = false;
        break;
        case 'computing':
        this.btnPushDisabled = true;
        break;
        case 'incompatible':
        this.btnPushDisabled = true;
        this.$q.notify('As notificações Push não são compatíveis com este navegador');
        break;
        case 'denied':
        this.btnPushDisabled = false;
        this.$q.notify('Ative as notififições');
        break;
        default:
        console.error('Estado do botão injector não tratado', state);
        break;
      }
    },

    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },

    checkNotificationPermission() {
      return new Promise((resolve, reject) => {
        if (Notification.permission === 'denied') {
          return reject(new Error('Push messages are blocked.'));
        }

        if (Notification.permission === 'granted') {
          return resolve();
        }

        if (Notification.permission === 'default') {
          return Notification.requestPermission().then(result => {
            if (result !== 'granted') {
              reject(new Error('Bad permission result'));
            }
            resolve();
          });
        }
      });
    },

    pushSubscribe() {
      this.changePushButtonState('computing');

      return this.checkNotificationPermission()
      .then(() => navigator.serviceWorker.ready)
      .then(serviceWorkerRegistration =>
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.applicationServerKey),
        })
      )
      .then(subscription => {
        return this.pushSendSubscriptionToServer(subscription, 'POST');
      })
      .then(subscription => subscription && this.changePushButtonState('enabled')) // update your UI
      .catch(e => {
        if (Notification.permission === 'denied') {
          console.warn('Notifications are denied by the user.');
          this.changePushButtonState('denied');
        } else {
          console.error('Impossible to subscribe to push notifications', e);
          this.changePushButtonState('disabled');
        }
      });
    },

    pushUpdateSubscription() {
      navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
      .then(subscription => {
        if (!subscription) {
          this.changePushButtonState('disabled')
        } else {
          this.changePushButtonState('enabled')
        }
      })
      .catch(e => {
        console.error('Error when updating the subscription', e);
      });
    },

    pushUnsubscribe() {
      this.changePushButtonState('computing');
      navigator.serviceWorker.ready
      .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
      .then(subscription => {
        if (!subscription) {
          this.changePushButtonState('disabled');
          return;
        }
        return this.pushSendSubscriptionToServer(subscription, 'DELETE');
      })
      .then(subscription => subscription.unsubscribe())
      .then(() => this.changePushButtonState('disabled'))
      .catch(e => {
        console.error('Error when unsubscribing the user', e);
        this.changePushButtonState('disabled');
      });
    },

    pushSendSubscriptionToServer(subscription, method) {
      const key = subscription.getKey('p256dh');
      const token = subscription.getKey('auth');
      const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];
      const endpoint = subscription.endpoint;
      const body = {
        endpoint: endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding,
      };
      switch (method) {
        case 'POST':
        return this.$api.post(`/auth_notify`, body).then(() => subscription);
        break;
        case 'PUT':
        return this.$api.put(`/auth_notify/${endpoint}`, body).then(() => subscription);
        break;
        case 'DELETE':
        return this.$api.delete(`/auth_notify/1`, body).then(() => subscription);
        break;
      }
    }
  },
  mounted () {
    if(!this.$q.platform.is.ios){
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers are not supported by this browser');
        this.changePushButtonState('incompatible');
        return;
      };

      if (!('PushManager' in window)) {
        console.warn('Push notifications are not supported by this browser');
        this.changePushButtonState('incompatible');
        return;
      };

      if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications are not supported by this browser');
        this.changePushButtonState('incompatible');
        return;
      };

      if (Notification.permission === 'denied') {
        console.warn('Notifications are denied by the user');
        this.changePushButtonState('denied');
        return;
      };
      this.pushUpdateSubscription();
    }
  }
}
