<h1>작성순서</h1>
<ol>
  <li value=1>
    <h3>npm init --yes</h3>
    <p>: 바로 package를 생성해준다.
  </li>
  <li value=2>
    <h3>npm install --save express axios babel-polyfill body-parser react react-dom react-addons-update react-router@3 redux redux-react path</h3>
    <p>: 기본적으로 필요한 의존모듈이다. database는 취향에 따라 설치한다.</p>
    <div>npm install --save mysql</div>
    <div>npm install --save mongoose</div>
  </li>
  <li value=3>
    <h3>npm install --save-dev babel-core babel-cli babel-loader babel-preset-react babel-preset-es2015 babel-preset-env webpack webpack-dev-server react-hot-loader css-loader style-loader</h3>
    <p>: 기본적으로 필요한 개발의존모듈이다. 추가적으로 필요한것이 있다면 설치하자.</p>
  </li>
</ol>

<pre>
  그리고, webpack.config.js && webpack.dev.config.js 를 작성한다.
  얘네들 작성하는 건 얼추 익숭해졌는데, webpack.dev.config > devServer 이 부분은 아직 못외웠다.
  다시 차근차근 살펴보자.
</pre>

<pre>
  devServer:{
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public'),
    proxy: {
      // 최신 버전에서는 "**"을 사용한다.
      // express port와 일치 시켜줘야한다.
      "**": "http://localhost:8080"
    },
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  },
</pre>
  