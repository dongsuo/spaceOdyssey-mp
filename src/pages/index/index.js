import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import windLevel, { windDir } from "./map";
import "./index.scss";

const PROXY_API = "https://dongsuo.leanapp.cn/proxy";

const IMAGE_API = `${PROXY_API}?url=https://api.unsplash.com/photos/random&client_id=e6f2095f8250387649ad01af8ef8fb94b19635ed602da9b67aa961810130d1aa&collections=1111575`;

const MARS_WEATHER_API = `${PROXY_API}?url=https://mars.nasa.gov/rss/api/&feed=weather&category=insight&feedtype=json&ver=1.0`;

function getNASAImage(that) {
  Taro.request({
    url: IMAGE_API
  }).then(resp => {
    if (resp.statusCode !== 200) {
      that.setState({
        imageUrl:
          "https://wpimg.wallstcn.com/c04f1938-9ec4-423f-9ac5-aa154d0bfe0e.jpg",
        imageDesc: "Looking Back on a Golden Opportunity"
      });
    } else {
      that.setState({
        imageUrl: resp.data.urls.small,
        imageDesc: resp.data.description || resp.data.alt_description
      });
    }
  });
}

function windLevelCal(speed) {
  let levelResult;
  windLevel.forEach(level => {
    if (speed >= level.speed[0] && speed <= level.speed[1]) {
      levelResult = level.level;
    }
  });
  return levelResult;
}

export default class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  onShareAppMessage() {
    return {
      title: `${
        this.state.today
      }火星平均气温：${this.state.todayWeather.data.AT.av.toFixed(1)}，${
        windDir[this.state.todayWeather.data.WD.most_common.compass_point]
      }风${windLevelCal(this.state.todayWeather.data.HWS.mn)}-${windLevelCal(
        this.state.todayWeather.data.HWS.mx
      )}级`,
      imageUrl: this.state.imageUrl
    };
  }
  constructor() {
    super();
    this.state = {
      today: undefined,
      todayWeather: {
        sol: 0
      },
      imageUrl: undefined
    };
  }

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true
    });
    Taro.setNavigationBarColor({
      backgroundColor: "#505050",
      frontColor: "#ffffff"
    });

    getNASAImage(this);

    Taro.showLoading();
    Taro.request({
      url: MARS_WEATHER_API
    }).then(resp => {
      Taro.hideLoading();
      const sol = resp.data.sol_keys.slice(-1)[0];
      const month = new Date(resp.data[sol].First_UTC).getMonth() + 1;
      const date = new Date(
        +new Date(resp.data[sol].First_UTC) + 8 * 3600 * 1000
      ).getDate();

      this.setState({
        today: month + "月" + date + "日"
      });
      this.setState({
        todayWeather: {
          sol: sol,
          data: resp.data[sol]
        }
      });
    });
  }

  render() {
    return (
      <View className='page'>
        <View className='section temperature-section'>
          {this.state.todayWeather.data && (
            <frameElement>
              <View className='temperature-num'>
                <View className='main-num'>
                  {this.state.todayWeather.data.AT.av.toFixed(1)}℃
                  <Text>平均</Text>
                </View>
                <View className='second-num'>
                  {this.state.todayWeather.data.AT.mx.toFixed(1)}℃ ~{" "}
                  {this.state.todayWeather.data.AT.mn.toFixed(1)}℃
                </View>
                <View className='second-num'>
                  {
                    windDir[
                      this.state.todayWeather.data.WD.most_common.compass_point
                    ]
                  }
                  风 {windLevelCal(this.state.todayWeather.data.HWS.mn)}-
                  {windLevelCal(this.state.todayWeather.data.HWS.mx)}级
                </View>
              </View>
              <View className='location-wrapper'>
                <View className='location-date'>
                  {this.state.today + " "}
                  {/* {` SOL ${this.state.todayWeather.sol}`} */}
                </View>
                <View className='location'>埃律西昂平原·火星</View>
                <View className='location'>太阳系·猎户支臂·银河系</View>
              </View>
            </frameElement>
          )}
        </View>
        {/* <Image className='image' mode='aspectFill' src={this.state.imageUrl}></Image> */}
        {/* <View style={{'text-transform': 'capitalize', 'font-size': '16px', 'text-align': 'center'}}>{(this.state.imageDesc || 'Photo ') +' ' } By NASA</View> */}

        <View className='section'>
          {this.state.todayWeather.data &&
            this.state.todayWeather.data.WD.most_common && (
              <frameElement>
                <View>风速</View>
                <View className='wd-section'>
                  <View className='second-num'>
                    {this.state.todayWeather.data.HWS.mx}m/s<Text>最高</Text>
                  </View>
                  <View className='second-num'>
                    {this.state.todayWeather.data.HWS.mn}m/s<Text>最低</Text>
                  </View>
                  <View className='second-num'>
                    {this.state.todayWeather.data.HWS.av}m/s<Text>平均</Text>
                  </View>
                </View>
              </frameElement>
            )}
        </View>

        <View className='section'>
          <View>气压</View>
          {this.state.todayWeather.data && (
            <View className='wd-section'>
              <View className='second-num'>
                {this.state.todayWeather.data.PRE.mx}Pa<Text>最高</Text>
              </View>
              <View className='second-num'>
                {this.state.todayWeather.data.PRE.mn}Pa<Text>最低</Text>
              </View>
              <View className='second-num'>
                {this.state.todayWeather.data.PRE.av}Pa<Text>平均</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
