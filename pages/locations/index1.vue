<template>
    <div class='google-maps-container'>
      <GmapMap
      ref="map"
      :center="center"
      :zoom="17"
      map-type-id="terrain"
      style="width: 100%; height: 800px"
    >
      <!-- <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      /> -->

      <gmap-polyline 
        v-bind:path.sync="path" 
        v-bind:options="
          { 
            strokeColor:'#008000'
          }">
       </gmap-polyline>
    </GmapMap>


        <!-- <gmap-map
            class='google-maps'
            :center="center"
            :zoom="3"
            map-type-id='terrain'
            :options="{
                disableDefaultUI: true
            }"
        >
            <gmap-marker
                :key="index"
                
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center=m.position"
            ></gmap-marker>
        </gmap-map> -->
    </div>
</template>

<script>

  export default { 
    props: ['position'],
    data () {
        return {
            center: {},
            markers: [],
            
            user_locations: [],
            path: []
        }
    },
    mounted() {
      this.setMapMarkers()
    },
    methods:{
      IsJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      },

      async setMapMarkers(){
        let distance  = 0
        this.user_locations = await this.$axios.get(`/user_locations?user_id=2`);

        this.user_locations.data.data.forEach((data, i) => {
          if(this.IsJsonString(data['content'])) {
            let loc = JSON.parse(data['content']);
            if(loc.hasOwnProperty('coords')) {
              this.markers.push({
                  position: {
                    lat: loc['coords']['latitude'],
                    lng: loc['coords']['longitude'],
                  },
                }
              )

              this.path.push({
                lat: loc['coords']['latitude'],
                lng: loc['coords']['longitude'],
              })
            }
          }
        })

        this.center = {
          lat: this.markers[0]['position']['lat'], 
          lng: this.markers[0]['position']['lng']
        }

        this.markers.forEach((m, i) => {
          if(i!= 0)
            {
              distance += this.distance(this.markers[i-1]['position']['lat'], this.markers[i-1]['position']['lng'], this.markers[i]['position']['lat'], this.markers[i]['position']['lng'], 'M')
            }
        })

        console.log(distance)
      },

      distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
          }
          else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
              dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="M") { dist = dist * 1.609344 * 1000 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
          }
        },

    }
  }
</script>

<style scoped lang="stylus">
    .google-maps-container
        position fixed    
        top 0px
        bottom 0px
        right 0px
        left 0px
        height 100vh
        width 100vw

    .google-maps
        position absolute
        top 0px
        bottom 0px
        right 0px
        left 0px        
</style>