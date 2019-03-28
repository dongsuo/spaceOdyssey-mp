import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import './about.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '关于'
  }
  onShareAppMessage() {
    return {
      title: '来看看今天火星天气怎么样吧^-^',
      imageUrl: 'https://wpimg.wallstcn.com/3ad9e90f-6a51-45f2-b4b6-f78d1f173993.png'
    }
  }
  constructor() {
    super()
  }

  componentWillMount () {
    Taro.showShareMenu({
      withShareTicket: true
    })
    
  }

  componentDidMount () {
    
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='page'>
        <View className='text-section'>
            <View className='header'>关于</View>
            <Text>
            星际漫游指南致力于为您提供关于星际旅行所需的一切情报与信息。银河系环境复杂，本应用提醒您，航线千万条，安全第一条，情报不准确，亲人两行泪。星际漫游指南祝您旅行愉快。
            </Text>
        </View>
        <View>
            数据来源：NASA
        </View>
        <View>
            图片来源：Unsplash
        </View>
      </View>
    )
  }
}

