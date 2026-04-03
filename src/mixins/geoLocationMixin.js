export const geoLocationMixin = {
  data () {
    return {
      latitude: 0,
      longitude: 0,
      mapsLink: '',
      permissionState: ''
    }
  },
  methods: {
    getCurrentPosition(){
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((location) => {
          this.latitude = location.coords.latitude;
          this.longitude = location.coords.longitude;
          this.mapsLink = 'https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude;
        })
      }else {
        this.$q.notify('Geolocalização não suportada.')
      }
    },
    getPermissionGeoLocation(){
        return navigator.permissions.query({name:'geolocation'})
    },
    geoLocationPermission(){
      return this.permissionState == 'granted' | this.permissionState =='prompt'
        ? true
        : false
    }
  },
  mounted () {
    this.getPermissionGeoLocation()
    .then((p) => {
        this.permissionState = p.state
          p.onchange = () => {
            this.permissionState = p.state
          }
    })
  }
}
