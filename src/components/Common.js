import define from '@/assets/js/define'
import calculator_list from '@/assets/yml/calculator.yml'
import aspect_list from '@/assets/yml/aspect.yml'
import planet_list from '@/assets/yml/planet.yml'

export default{
/*  data(){
    return{
      a:"bb"
    }
  },*/
  created(){
    
    window.setting = {
      orb:{
        midpoint: 1.5,
        harmonics: 5,
      },
      astronomical_model: "",
      year_milisecond: 365.2425 * 24 * 60 * 60 * 1000,
    }

    Number.prototype.abs = function(){
      return Math.abs(this)
    }

    String.prototype.abs = function(){
      return parseFloat(this).abs()
    }

    String.prototype.getAspectIcon = function(){
      return '/img/aspect/'+aspect_list[this].img
    }

    Number.prototype.getDegree = function(){
      return this.int() % 30 + 1;
    }

    Number.prototype.getDegreeMinute = function(){
      return (this.int() % 30)+'˚'+((this*60).int() % 60).zeroPadding(2)+'′';
    }

    Number.prototype.getImg = function(size){
      let img_base_url = define.IMG_BASE_URL
      switch(size){
        case 'full':
          img_base_url = define.FULL_SIZE_IMG_BASE_URL
          break
      }

      let _this = this % 360
      const sign = ((_this / 30).int() + 1).zeroPadding(2);
      const degree = ((_this % 30).int() + 1).zeroPadding(2);
      return img_base_url + sign + '/' + degree + '.jpg';
    }

    String.prototype.getImg = function(size){
      return parseFloat(this).getImg(size)
    }

    Number.prototype.getMinute = function(){
      return ((this*60).int() % 60).zeroPadding(2)
    }

    String.prototype.getPlanetIcon = function(){
      return '/img/planet/'+this+'.svg';
    }

    String.prototype.getSignNumber = function(){
      const this_sign = this.toUpperCase()
      const sign_list = {
        ARIES:0,
        TAURUS:1,
        GEMINI:2,
        CANCER:3,
        LEO:4,
        VIRGO:5,
        LIBRA:6,
        SCORPIO:7,
        SAGITTARIUS:8,
        CAPRICORN:9,
        AQUARIUS:10,
        PISCES:11
      }
      const sign_num = sign_list[this_sign]
      return (sign_num === null || sign_num === undefined) ? null : sign_num
    }

    Boolean.prototype.getSummerWinter = function(){
      return this ? 'S' : 'W'
    }

    Date.prototype.getSummerWinter = function(){
      return this.isSummertime() ? 'S' : 'W'
    }

    Date.prototype.getTimezone = function(){
      if(this.isSummertime()){
        return this.getTimezoneOffset() / -60 - 1;
      }
      else{
        return this.getTimezoneOffset() / -60;
      }
    }

    Date.prototype.getTimezoneStr = function(){
      return this.getTimezone().getTimezoneStr()
    }

    Number.prototype.getTimezoneStr = function(){
      const plus_minus = this < 0 ? 'W' : 'E'
      const time = this.intAbs().zeroPadding(2) + (this * 60 % 60).int().zeroPadding(2)
      return plus_minus + time
    }

    String.prototype.getTimezoneStr = function(){
      return this.int().getTimezoneStr()
    }


    Number.prototype.int = function(){
      return parseInt(this)
    }

    String.prototype.int = function(){
      return parseInt(this)
    }

    Number.prototype.intAbs = function(){
      return Math.abs(this).int()
    }

    String.prototype.intAbs = function(){
      return parseFloat(this).intAbs()
    }

    String.prototype.isForecast = function(){
      let res = false
      const obj = calculator_list.forecast.list
      Object.keys(obj).forEach((k)=>{
        if(k === this) res = true; return
      })
      return res
    }

    Date.prototype.isSummertime = function(){
      return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }

    String.prototype.isPartner = function(){
      let res = false
      const obj = calculator_list.relationship.list
      Object.keys(obj).forEach((k)=>{
        if(k === this) res = true; return
      })
      return res
    }

    // サマータイム判定
    Date.prototype.stdTimezoneOffset = function(){
      var jan = new Date(this.getFullYear(), 0, 1)
      var jul = new Date(this.getFullYear(), 6, 1)
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    }

    Date.prototype.toStr = function(type){
      this.setHours(this.getHours() + this.getTimezoneOffset() * -1/60)
      const dt = this.toISOString()
      //this.setHours(this.getHours() + this.getTimezoneOffset() * 1/60)

      switch(type){
        case "yyyy-MM-dd": 
          return dt.slice(0,10)
        case "HHmm":
          return dt.slice(11,16).replace(":", "")
        case "HH:mm":
          return dt.replace(/(\d{2})(\d{2})/, "$1:$2")
        case "yyyyMMddHHmm":
          return dt.slice(0,4)+dt.slice(5,7)+dt.slice(8,10)+dt.slice(11,13)+dt.slice(14,16)
      }
    }

    Number.prototype.zeroPadding = function(digit){
      var zero = "";
      for(var i=1; i<digit; i++){
        zero += "0";
      }
      return (zero + this).substr(-digit);
    }

    String.prototype.zeroPadding = function(digit){
      return this.int().zeroPadding(digit)
    }

  },
  mounted(){

  },

  methods: {
    $$(selector){
      return document.querySelector(selector);
    },

    $$$(selector){
      return document.querySelectorAll(selector);
    },


    addPlanetsInfo(planets, houses){
      if(!this.current_planet_list) this.setAstronomicalModel()

      if(!planets) planets = {}

      this.current_planet_list.forEach((p)=>{
        if(!planets[p]) planets[p] = {}
        planets[p] = Object.assign(planets[p], this.getPlanetInfo(p))

        if(planets[p].longitude){
          planets[p] = Object.assign(planets[p], this.getDegreeInfo(planets[p].longitude))
        }
      })

      if(houses && houses[10]){
        planets.Asc = {}
        planets.Asc.longitude = houses[1]
        planets.Asc = Object.assign(planets.Asc, this.getPlanetInfo('Asc'))
        planets.Asc = Object.assign(planets.Asc, this.getDegreeInfo(houses[1]))
        planets.Mc = {}
        planets.Mc.longitude = houses[10]
        planets.Mc = Object.assign(planets.Mc, this.getPlanetInfo('Mc'))
        planets.Mc = Object.assign(planets.Mc, this.getDegreeInfo(houses[10]))

        if(this.$route.query.m === 'asc_aries' || this.$route.query.m === 'mc_capricorn'){
          let house_sabian_planets = {}

          this.current_planet_list.forEach((p)=>{
            house_sabian_planets[p] = {}
            house_sabian_planets[p] = Object.assign(house_sabian_planets[p], this.getPlanetInfo(p))

            if(planets[p].longitude){
              if(this.$route.query.m === 'asc_aries'){
                house_sabian_planets[p].longitude = planets[p].longitude - houses[1]
              }
              else if(this.$route.query.m === 'mc_capricorn'){
                house_sabian_planets[p].longitude = planets[p].longitude - houses[10] + 270
              }
              if(house_sabian_planets[p].longitude < 0) house_sabian_planets[p].longitude += 360
              
              house_sabian_planets[p] = Object.assign(house_sabian_planets[p], this.getDegreeInfo(house_sabian_planets[p].longitude))
            }
          })

          return house_sabian_planets
        }
      }

      return planets
    },

    changeDatetimeQueryFormat(query, type){
      if(!this.checkDatetimeQuery(query)) return false

      let year = query.slice(0,4)
      let month =query.slice(4,6)
      let day = query.slice(6,8)
      let hour = query.slice(8,10)
      let minute = query.slice(10,12)
      let timezone_plus_minus = query[12] === 'E' ? 1 : -1
      let timezone = timezone_plus_minus * (query.slice(13,15).int() + query.slice(15,17) / 60)
      let unknown_time = 0
      let summertime = query[17] === 'S' ? 1 : 0
      if(query.slice(8,12) === '----'){
        hour = '12'
        minute = '00'
        unknown_time = 1
      }

      switch(type){
        case "TEXT":
          if(unknown_time) return this.changeDatetimeQueryFormat(query, 'TEXT_DATE')
          return this.$t('calculator.datetime_view').replace('{year}', year).replace('{month}', this.getMonth(month)).replace('{day}', day.int()).replace('{hour}', hour).replace('{minute}', minute)
        case "TEXT_DATE":
          return this.$t('calculator.date_view').replace('{year}', year).replace('{month}', this.getMonth(month)).replace('{day}', day.int())
        case "yyyy-MM-dd": 
          return year + '-' + month + '-' + day
        case "HH:mm":
          return hour + ':' + minute
        case 'yyyy-MM-ddTHH:mm:00':
          return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00'
        case 'array':
          return {year: year, month: month, day: day, hour: hour, minute: minute, timezone: timezone+summertime}
        case 'timezone':
          return timezone
        case 'summertime_flg':
          return query[17] === 'S' ? 1 : 0
        case 'unknown_flg':
          return unknown_time
      }
    },

    changeDatetimeToQuery(date, time, timezone, summertime, unknown){
      let str = ''
      str += date.slice(0,4)+date.slice(5,7)+date.slice(8,10)
      if(unknown){
        str += '----'
      }
      else{
        str += time.slice(0,2)+time.slice(3,5)
      }

      str += timezone.getTimezoneStr()
      str += summertime.getSummerWinter()

      return str
    },

    checkDatetimeQuery(datetime_query){
      if(datetime_query && datetime_query.match(/^([0-2][0-9]{3})(0[1-9]|1[0-2])([0-2]\d|3[01])(([01][0-9]|2[0-3])([0-5][0-9])|----)([EW][01][0-9][0-5][0-9])([SW])$/)) return true
      return false
    },

    changeLocationToQuery(lat_ns, lat_degree, lat_minute, lon_ew, lon_degree, lon_minute){
      let res = ''

      res += lat_ns === 'S' ? 'S' : 'N'
      res += lat_degree.zeroPadding(2)
      res += lat_minute.zeroPadding(2)
      res += lon_ew === 'W' ? 'W' : 'E'
      res += lon_degree.zeroPadding(3)
      res += lon_minute.zeroPadding(2)

      return res
    },

    changeLocationQueryFormat(query, type){
      if(!this.checkLocationQuery(query)){
        return false
      }

      const NS = query.slice(0, 1)
      const lat_degree = query.slice(1, 3).int()
      const lat_minute = query.slice(3, 5).int()
      const EW = query.slice(5, 6)
      const lon_degree = query.slice(6, 9).int()
      const lon_minute = query.slice(9, 11).int()
      const NS_plus_minus = NS === 'N' ? 1 : -1
      const EW_plus_minus = EW === 'E' ? 1 : -1

      switch(type){
        case 'NS':
          return NS
        case 'lat_degree':
          return lat_degree
        case 'lat_minute':
          return lat_minute
        case 'EW':
          return EW
        case 'lon_degree':
          return lon_degree
        case 'lon_minute':
          return lon_minute
        case 'lat_num':
          return NS_plus_minus * (lat_degree + lat_minute / 60)
        case 'lon_num':
          return EW_plus_minus * (lon_degree + lon_minute / 60)
      }
    },

    checkLocationQuery(location_query){
      if(location_query && location_query.match(/^[NS]\d{4}[EW]\d{5}$/)) return true
      return false
    },

    getAspect(degree1, degree2, accepted_orb){
      var diff = this.getDiffAbs(degree1, degree2);

      for(var i in aspect_list){
        var orb = Math.abs(diff - aspect_list[i].degree);

        if(orb < accepted_orb){
          return {aspect: aspect_list[i], orb: orb};
        }
      }
      return null;
    },

    getDegreeInfo(longitude, is_int){
      if(longitude < 0) longitude += parseInt(longitude / 360 + 1) * 360
      longitude = parseFloat(longitude) % 360

      if(is_int === 'int' ||
        (is_int && longitude == longitude.toFixed(3))){
        is_int = true;
      }
      else{
        is_int = false;
      }

      let planet = {}
      planet.img = longitude.getImg()
      planet.sign_degree = this.getSignDegree(longitude)
      planet.degree_minute = longitude.getDegreeMinute();
      planet.sabian = this.$t('sabian['+longitude.int()+']')
      //planet.sabian_description = sabian_descriptions[parseInt(longitude)];
      planet.param = {
        sign: define.SIGN_LIST[(longitude / 30).int()].key,
        degree: (longitude % 30).int() + 1,
        minute: longitude.getMinute(),
      }
      planet.is_int = is_int;
      planet.symbol_minute = (longitude * 60 % 60).int();
      planet.alt = this.$t('common.sabian_symbol') + ' ' + planet.sign_degree + ': ' + planet.sabian

      return planet
    },

    getDiff(degree1, degree2){
      var d1 = degree1 % 360;
      var d2 = degree2 % 360;

      if(d1 > d2) d2 += 360;

      if(d2 - d1 > 180) return (d2 - d1) - 360;
      else return d2 - d1;
    },

    getDiffAbs(degree1, degree2){
      return Math.abs(this.getDiff(degree1, degree2));
    },

    getDiffYear(){
      //時間の差を計算
      const natal_date = new Date(this.changeDatetimeQueryFormat(this.$route.query.n, 'yyyy-MM-ddTHH:mm:00'));
      const forecast_date = new Date(this.changeDatetimeQueryFormat(this.$route.query.f, 'yyyy-MM-ddTHH:mm:00'));
      return (forecast_date - natal_date) / define.year_milisecond;
    },

    getMonth(num){
      return this.$t('calculator.month['+(num.int() -1)+']')
    },

    getPlanetIcon(planet){
      planet = planet.replace(/(True|Mean)/, '')
      return '/img/planet/'+planet+'.svg';
    },

    getPlanetInfo(planet){
      let res = {}
      res.key = planet_list[planet].key
      res.name = this.$t('planet_list.'+planet+'.name');
      res.description = this.$t('planet_list.'+planet+'.description');
      res.icon = this.getPlanetIcon(planet);
      return res
    },

    getSign(longitude){
      const sign_num = (longitude % 360 / 30).int()
      return this.$t('sign_list['+sign_num+']')
    },

    getSignDegree(longitude){
      longitude %= 360;
      if(window.lang === 'ja') return this.getSign(longitude) + longitude.getDegree() + '度';
      return this.getSign(longitude) + ' ' + longitude.getDegree()
    },

    getSummertime(now){
      return this.isSummertime(now) ? 'S' : 'W';
    },

    getThisYear(){
      var now = new Date();
      return now.getFullYear();
    },

    getVectorAverage(degrees){
      let x = 0
      let y = 0
      degrees.map(degree => (
        x += Math.cos(degree / 180 * Math.PI),
        y += Math.sin(degree / 180 * Math.PI)
      ));

      var radian = Math.acos(x / (x**2 + y**2) ** (1/2));
      var degree = radian / Math.PI * 180;
      degree = y >= 0 ? degree : 360 - degree;
      return degree;
    },

    hide_set_datetime(){
      if(this.$$('#set_datetime')){
        this.$$('#set_datetime').classList.add("hide");
        this.$$('#set_datetime').classList.remove("show");
        this.$$('body').classList.remove("fix");
      }
    },

    isAspect(degree1, degree2, orb, aspect_name){
      var aspect = aspect_list[aspect_name];
      if(!aspect) return false;
//console.log(degree1, degree2, orb, aspect_name)
      var aspect_degree = aspect.degree;
      var diff = this.getDiffAbs(degree1, degree2);

      if(diff >= aspect_degree - orb && diff <= aspect_degree + orb){
        return true;
      }

      return false;
    },
/*
    onBlurDate(input_id){
      var date_val = this.$$('#'+input_id).value;
      if(!date_val ||
        date_val.match(/^[3-9]/) ||
        date_val.match(/^00/)
      ){
        var date = new Date();
        var yyyy = date.getFullYear();
        var MM = ("0"+(date.getMonth()+1)).slice(-2);
        var dd = ("0"+date.getDate()).slice(-2);

        this.$$('#'+input_id).value = yyyy+'-'+MM+'-'+dd;
      }
    },*/

    onBlurTime(input_id){
      var time_val = this.$$('#'+input_id).value;
      if(!time_val){
        var date = new Date();
        var HH = ("0"+date.getHours()).slice(-2);
        var mm = ("0"+date.getMinutes()).slice(-2);

        this.$$('#'+input_id).value = HH+':'+mm;
      }
    },

    setAstronomicalModel(){
      const pl_list = ['n', 'p', 'f']

      if(this.$route.query.m === 'helio'){
        pl_list.forEach((i)=>{
          if(this[i] && this[i].pl) this[i].pl.setHeliocentric();
        })
        this.current_planet_list = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
        this.main_planet_list = ["Pluto", "Neptune"]
        this.$$('html').classList.add('special_astro_model');
      }

      else{
        pl_list.forEach((i)=>{
          if(this[i] && this[i].pl) this[i].pl.unsetHeliocentric();
        })

        let true_mean_node = this.$cookies.get('true_mean_node') == 1 ? 'MeanNode': 'TrueNode'
        let true_mean_lilith = this.$cookies.get('true_mean_lilith') == 1 ? 'MeanLilith': 'TrueLilith'
        this.current_planet_list = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", true_mean_node, true_mean_lilith]
        this.main_planet_list = ["Sun", "Moon"]

        //ハウスサビアン
        if(this.$route.query.m === 'asc_aries' || this.$route.query.m === 'mc_capricorn'){
          this.$$('html').classList.add('special_astro_model');
        }

        //ノーマル
        else{
          if(this.$route.query.n &&
             !this.changeDatetimeQueryFormat(this.$route.query.n, 'unknown_flg')){
            this.current_planet_list.push('Asc')
            this.current_planet_list.push('Mc')
          }

          this.$$('html').classList.remove('special_astro_model');
        }
      }
    },

    setImgCookie(longitude){
      if(!longitude) this.$cookies.remove('img')

      longitude = longitude.int() + 1
      longitude %= 360
      
      this.$cookies.set('img', longitude)
    },

    toggle_set_datetime(){
      if(this.$$('#set_datetime')){
        if(this.$$('#set_datetime').classList.contains("show")){
          this.$$('#set_datetime').classList.add("hide");
          this.$$('#set_datetime').classList.remove("show");
          this.$$('body').classList.remove("fix");
        }
        else{
          this.$$('#set_datetime').classList.add("show");
          this.$$('#set_datetime').classList.remove("none");
          this.$$('#set_datetime').classList.remove("hide");
          this.$$('body').classList.add("fix");
        }
      }
    },

  }
}
