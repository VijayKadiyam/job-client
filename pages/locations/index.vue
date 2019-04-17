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
      <v-flex md3>
       <v-menu
          ref="dateMenu"
          :close-on-content-click="false"
          v-model="dateMenu"
          :nudge-right="40"
          :return-value.sync="date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            :error-messages="errors.date"
            slot="activator"
            v-model="date"
            label="Date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="fetchLocations">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <gmap-map
      ref="mapRef"
      :center="center"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
      <gmap-polyline 
        :path.sync="path" 
        :options="options">
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
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.time_stamp }}</td>
        <td>{{ props.item.lat }} - {{ props.item.lng }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.battery }}</td>
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
      { text: 'Time Stamp', value: 'time_stamp' },
      { text: 'Lat - Long', value: 'lat_lng' },
      { text: 'Activity Type', value: 'type' },
      { text: 'Battery', value: 'battery' },
      { text: 'Distance', value: 'distance' },
    ],
    locations: [],
    user_locations: [],
    center: {lat: 19.0760, lng: 72.8777},
    markers: [],
    path: [],
    distance: 0,
    dateMenu: false,
    date: '',
    options: {
      
    }
  }),
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => {
      this.options = {
        strokeColor: 'green',
        icons: [{
          icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
          offset: '100%',
          repeat: '50px',
          color: 'black'
        }]
      }
    })
  },
  methods: {
    async fetchLocations() {
      if(this.date == '' || this.user_id == '')
        return;
      this.$refs.dateMenu.save(this.date)
      this.user_locations = await this.$axios.get(`/user_locations?user_id=${this.user_id}&date=${this.date}`);
      this.markers = []
      this.path = []
      this.locations = []
      this.distance = 0


      this.user_locations.data.data.forEach((data, i) => {
        if(this.IsJsonString(data['content'])) {
          let loc = JSON.parse(data['content']);
          // console.log(loc)
          if(loc.hasOwnProperty('coords')) {
            this.markers.push({
                position: {
                  lat: loc['coords']['latitude'],
                  lng: loc['coords']['longitude'],
                  time: data.updated_at
                },
              }
            )

            this.path.push({
              lat: loc['coords']['latitude'],
              lng: loc['coords']['longitude'],
            })
          }
        }
        else{
          if(data.content.coords) {
            if(i != 0) {
              this.distance += this.distanceFun(this.locations[i-1]['lat'], this.locations[i-1]['lng'], data.content.coords.latitude, data.content.coords.longitude, 'K')
            }
            this.locations.push({
              'time_stamp': data.updated_at,
              'lat': data.content.coords.latitude,
              'lng': data.content.coords.longitude,
              'type': data.content.activity.type,
              'battery': data.content.battery.level + ' (Charging:' + data.content.battery.is_charging + ')',
              'distance': parseFloat(this.distance).toFixed(2)
            })

            if(i == 0 | i == this.user_locations.data.data.length - 1)
              this.markers.push({
                  position: {
                    lat: data.content.coords.latitude,
                    lng: data.content.coords.longitude,
                  },
                }
              )

            this.path.push({
              lat: data.content.coords.latitude,
              lng: data.content.coords.longitude,
            })
          }
        }
      })

      this.center = {
        lat: this.locations[0]['lat'], 
        lng: this.locations[0]['lng']
      }
      this.distance = 0
      this.locations.forEach((m, i) => {
        if(i!= 0)
        {
          this.distance += this.distanceFun(this.locations[i-1]['lat'], this.locations[i-1]['lng'], this.locations[i]['lat'], this.locations[i]['lng'], 'K')
        }
      })
      // this.locations.push({
      //   'distance': this.distance
      // })
    },

    setMapMarkers(){
      for(var index = 0; index < this.locations.length; index++) {
        var point = new google.maps.LatLng(
            parseFloat(this.locations[index].lat),
            parseFloat(this.locations[index].lng)
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