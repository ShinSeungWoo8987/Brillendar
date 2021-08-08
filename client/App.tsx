import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import LoadingScreen from './LoadingScreen';
import LoadFont from './LoadFont';
import AuthContainer from './src/components/navigator/Auth/AuthContainer';
import DrawerContainer from './src/components/navigator/Drawer/DrawerContainer';

import { setupAxiosInterceptors, getSecureStoreValueByKey } from './src/functions';
import { serverUrl } from './env';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'Loading' | 'Auth' | 'Main'>('Loading');

  // apollo store에 access token을 저장하면 변경할때마다 App컴포넌트 전체가 리렌더되어 refresh token을 필요이상으로 요청하게된다.
  // 그걸 방지하기위해
  const [accessToken, setAccessToken] = useState<null | string>(null);

  useEffect(() => {
    getSecureStoreValueByKey('access_token')
      .then((token) => {
        // 토큰이 있으면, axios로 refresh token받아서 재설정
        if (token) {
          axios
            .get(serverUrl + '/refresh_token', {
              headers: {
                authorization: `barer ${token}`,
              },
            })
            .then((res) => {
              if (res.data?.error) {
                // refresh token을 재발급 받지 못한경우
                console.log(res.data.error);
                setScreen('Auth');
              } else {
                // refresh token을 정상적으로 재발급 받은 경우
                setAccessToken(res.data.refreshToken);
                setupAxiosInterceptors(res.data.refreshToken);
                setScreen('Main');
              }
            })
            .catch((err) => console.log(err));
        } else {
          // 토큰이 없으면 Auth로 이동
          setScreen('Auth');
        }
      })
      .catch((err) => {
        setScreen('Auth');
      });
  }, []);

  useEffect(() => {
    // 로그아웃하게되면, secure storage에서 삭제 이후 access token을 null로 바꿔주게되는데,
    // screen이 loading이 아니면서 access token이 없는 경우가 된다. (맨처음 앱을 켤때만 screen이 loading임)
    // 따라서, 해당하는경우에 Auth로 이동시켜준다.
    if (screen !== 'Loading') {
      if (!accessToken) setScreen('Auth');
      // 그렇지 않은 경우는 screen이 auth였다가,
      // LoginScreen에서 로그인을 성공해서 access token값을 갱신해준 경우로 Main으로 이동시켜준다.
      else setScreen('Main');
    }
  }, [accessToken]);

  const client = new ApolloClient({
    // uri: 'http://localhost:5000/graphql',
    uri: serverUrl + '/graphql',

    credentials: 'include',
    cache: new InMemoryCache(),
    headers: { authorization: accessToken ? `barer ${accessToken!}` : '' },
  });

  if (screen === 'Loading') return <LoadingScreen />;

  return (
    <ApolloProvider client={client}>
      {screen === 'Auth' ? (
        <LoadFont>
          <AuthContainer setAccessToken={setAccessToken} />
        </LoadFont>
      ) : (
        <LoadFont>
          <DrawerContainer setAccessToken={setAccessToken} />
        </LoadFont>
      )}
    </ApolloProvider>
  );

  /*
    1. 저장된 access token이 있는지 확인
    2. 그 access token으로 새 토큰 받아오기
    3. 받아온 새 토큰 저장하고 정상적으로 사용
    
  */
};

export default App;
