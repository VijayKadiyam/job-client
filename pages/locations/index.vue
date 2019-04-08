<template>
  <section>
    <span class="title">Track Location</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="user_id"
          :items="users"
          label="Select Employee"
          @input="fetchLocations"
        ></v-select>
      </v-flex>
    </v-layout>

    <gmap-map
      :center="center"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
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
        :path.sync="path" 
        :options="
          { 
            strokeColor:'#008000'
          }">
       </gmap-polyline> 
    </gmap-map>
    <!-- <no-ssr>
      <download-excel
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "LeaveApplication.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr> -->
    <v-data-table
      v-if="user_id"
      :headers="headers"
      :items="locations"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>Distance</td>
        <td>{{ props.item.distance }} KM</td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

import Vue from 'vue'

export default {
  name: 'LocationReports',
  async asyncData({$axios}) { 
    let users = await $axios.get('/users?search=all');
    users = users.data.data.map(user => ({
      'text': user.name,
      'value': user.id
    }))
    users.push({
      'text': 'admin',
      'value': 2
    })
    return {
      users: users
    }
  },
  data: () => ({
    user_id: '',
    loading: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'User',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Distance', value: 'distance' }
    ],
    locations: [],
    user_locations: [],
    center: {lat: 19.0760, lng: 72.8777},
    markers: [],
    path: [],
    distance: 0
  }),
  methods: {
    async fetchLocations(user_id) {
      this.user_locations = await this.$axios.get(`/user_locations?user_id=${user_id}`);
      this.markers = []
      this.path = []

      this.user_locations.data.data.forEach((data, i) => {
        if(this.IsJsonString(data['content'])) {
          let loc = JSON.parse(data['content']);
          console.log(loc)
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
      this.distance = 0
      this.markers.forEach((m, i) => {
        if(i!= 0)
        {
          this.distance += this.distanceFun(this.markers[i-1]['position']['lat'], this.markers[i-1]['position']['lng'], this.markers[i]['position']['lat'], this.markers[i]['position']['lng'], 'K')
        }
      })
      this.locations.push({
        'distance': this.distance
      })
      console.log(this.distance)
    },

    setMapMarkers(){
      for(var index = 0; index < this.markers.length; index++) {
        var point = new google.maps.LatLng(
            parseFloat(this.markers[index]['position'].lat),
            parseFloat(this.markers[index]['position'].lng)
        )

        var marker = new google.maps.Marker({
            map: this.$refs['vue-map'],
            position: point,
        })
      }
    },

    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    distanceFun(lat1, lon1, lat2, lon2, unit) {
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
  },
}
</script>