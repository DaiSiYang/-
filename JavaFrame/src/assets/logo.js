// 创建一个简单的SVG logo组件
export default {
  name: 'LogoIcon',
  render() {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="12" fill="#409EFF" />
        <text
          x="32"
          y="40"
          fill="white"
          font-size="32"
          text-anchor="middle"
          font-weight="bold"
        >
          W
        </text>
      </svg>
    )
  }
} 