import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import windLevel, { windDir } from "./map";
import {fetch} from '../../utils'
import "./index.scss";

const baseUrl = "https://1314521.ml/release/"


function getNASAImage(that) {
  fetch({
    url: 'https://api.unsplash.com/photos/random',
    client_id: 'e6f2095f8250387649ad01af8ef8fb94b19635ed602da9b67aa961810130d1aa',
    collections: '1111575'
  }).then(resp => {
    if (!resp || resp.urls.small !== 200) {
      that.setState({
        imageUrl:
          "https://wpimg.wallstcn.com/c04f1938-9ec4-423f-9ac5-aa154d0bfe0e.jpg",
        imageDesc: "Looking Back on a Golden Opportunity"
      });
    } else {
      that.setState({
        imageUrl: resp.urls.small,
        imageDesc: resp.description || resp.alt_description
      });
    }
  });
}

function windLevelCal(speed) {
  let levelResult;
  // 取一位小数
  speed = Math.round(speed*10)/10
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
    Taro.showLoading();
    Taro.request({
      url: baseUrl + 'solDate'
    }).then(resp => {      
      const data = JSON.parse(resp.data.body).sort((a,b) => {
        return a.sol-b.sol
      })
      const sol = data.pop();
      const month = new Date(sol.first_utc).getMonth() + 1;
      const date = new Date(sol.first_utc).getDate();

      this.setState({
        todayWeather: {
          sol: sol.sol
        },
        today: month + "月" + date + "日"
      });
      Taro.request({
        url: baseUrl + 'mars_weather?start=' + sol.sol
      }).then(resp => {
        Taro.hideLoading();
        const data = {
          PRE: resp.data.pre[0],
          AT: resp.data.temperature[0],
          WD: resp.data.wind[0],
          mostCommonWind: resp.data.mostCommonWind
        }
        this.setState({
          todayWeather: {
            data
          }
        })
      })
    })
    getNASAImage(this);
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
                  <Text className='sm-text'>平均</Text>
                </View>
                <View className='second-num'>
                  {this.state.todayWeather.data.AT.mx.toFixed(1)}℃ ~{" "}
                  {this.state.todayWeather.data.AT.mn.toFixed(1)}℃
                </View>
                <View className='second-num'>
                  {
                    windDir[
                    this.state.todayWeather.data.mostCommonWind.compass_point
                    ]
                  }
                  风 {windLevelCal(this.state.todayWeather.data.WD.mn)}-
                  {windLevelCal(this.state.todayWeather.data.WD.mx)}级
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
                    {this.state.todayWeather.data.WD.mx}m/s<Text>最高</Text>
                  </View>
                  <View className='second-num'>
                    {this.state.todayWeather.data.WD.mn}m/s<Text>最低</Text>
                  </View>
                  <View className='second-num'>
                    {this.state.todayWeather.data.WD.av}m/s<Text>平均</Text>
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
                {this.state.todayWeather.data.PRE.mx.toFixed(2)}Pa<Text>最高</Text>
              </View>
              <View className='second-num'>
                {this.state.todayWeather.data.PRE.mn.toFixed(2)}Pa<Text>最低</Text>
              </View>
              <View className='second-num'>
                {this.state.todayWeather.data.PRE.av.toFixed(2)}Pa<Text>平均</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
