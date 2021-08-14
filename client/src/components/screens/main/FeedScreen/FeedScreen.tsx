import React, { useEffect } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import styled from 'styled-components/native';

import OngoingScheduleItem from './OngoingScheduleItem';

import ScheduleItem from './ScheduleItem';
import { useReactiveVar } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { screenModeVar } from '../../../../stores';
import { Container, HeaderSection, HeaderView, NavItem, TextMode } from '../../../../styles/styled';
import { addDays, startOfDay } from 'date-fns';
import { syncServerRequestTime, seoulToLocalTime, fixNewDateError } from '../../../../functions';
import { useReadFeedScheduleQuery, Feed, useReadFeedScheduleLazyQuery } from '../../../../generated/graphql';
import { Feather } from '../../../../styles/vectorIcons';

import appTheme, { windowHeight } from '../../../../styles/constants';

const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface FeedScreenProps extends MainNavProps<'Feed'> {}

const FeedScreen: React.FC<FeedScreenProps> = ({ route, navigation }) => {
  const screenMode = useReactiveVar(screenModeVar);

  const now = new Date();

  // const { data, loading, error } = useReadFeedScheduleQuery({
  //   fetchPolicy: 'cache-first',
  //   variables: {
  //     feedInput: {
  //       day_start: Number(fixNewDateError(syncServerRequestTime(startOfDay(now)))),
  //       day_end: Number(fixNewDateError(syncServerRequestTime(startOfDay(addDays(now, 1))))),
  //     },
  //   },
  // });

  const [readFeedSchedule, { data, loading, error }] = useReadFeedScheduleLazyQuery({
    fetchPolicy: 'network-only',
    variables: {
      feedInput: {
        day_start: Number(fixNewDateError(syncServerRequestTime(startOfDay(now)))),
        day_end: Number(fixNewDateError(syncServerRequestTime(startOfDay(addDays(now, 1))))),
      },
    },
  });

  useEffect(() => {
    readFeedSchedule();
  }, []);

  // console.log(data?.readFeedSchedule.error);
  // console.log(data?.readFeedSchedule.feed);

  const ongoingFeedTemp = data?.readFeedSchedule.feed?.map(
    ({ schedules, member: { id, username, profile_img, follower_count } }) => {
      const ongoingSchedules = schedules.filter(
        ({ start_at, finish_at }) => seoulToLocalTime(start_at) <= now && seoulToLocalTime(finish_at) >= now
      );

      if (ongoingSchedules.length > 0) {
        const { title } = ongoingSchedules[0];
        return { id, username, profile_img, follower_count, title };
      } else {
        return null;
      }
    }
  );

  const ongoingFeed = ongoingFeedTemp?.filter((f) => f !== null) as OngoingFeed[];

  const errorScreen = (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={readFeedSchedule} />}
    >
      <Center style={{ height: windowHeight - 111 }}>
        <AlertText screenMode={screenMode}>잠시후에 다시 시도해주세요.</AlertText>
      </Center>
    </ScrollView>
  );

  const noFeedScreen = (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={readFeedSchedule} />}
    >
      <Center style={{ height: windowHeight - 111 }}>
        <AlertText screenMode={screenMode}>표시할 스케줄이 없습니다.</AlertText>
        <AlertText screenMode={screenMode}>다른 사용자를 팔로우해보세요.</AlertText>
      </Center>
    </ScrollView>
  );

  return (
    <Container screenMode={screenMode}>
      <StatusBar style={screenMode === 'dark' ? 'light' : 'dark'} />
      <HeaderView screenMode={screenMode}>
        <Logo screenMode={screenMode}>Brillendar</Logo>
      </HeaderView>

      {loading ? (
        <Center>
          <ActivityIndicator size="large" color="gray" />
        </Center>
      ) : data === undefined || error || data.readFeedSchedule.error ? (
        errorScreen
      ) : data && data.readFeedSchedule.feed?.length === 0 ? (
        noFeedScreen
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={readFeedSchedule} />}
        >
          <OngoingSchedule screenMode={screenMode} horizontal={true}>
            {ongoingFeed.length !== 0 ? (
              ongoingFeed.map(({ id, username, profile_img, follower_count, title }) => (
                <OngoingScheduleItem
                  key={id}
                  route={route}
                  navigation={navigation}
                  id={id}
                  username={username}
                  profile_img={profile_img}
                  follower_count={follower_count}
                  title={title}
                />
              ))
            ) : (
              <AlertText screenMode={screenMode}>지금 진행중인 스케줄이 없어요.</AlertText>
            )}

            <View style={{ width: 20 }} />
          </OngoingSchedule>
          {/* ///////////////////////////////////////// */}

          <ScheduleFeed contentContainerStyle={{ paddingHorizontal: SIZES.paddingHorizontal, paddingBottom: 12 }}>
            {data.readFeedSchedule.feed?.map((feed) => (
              <ScheduleItem key={feed.member.id} route={route} navigation={navigation} feed={feed as Feed} />
            ))}
          </ScheduleFeed>
        </ScrollView>
      )}
    </Container>
  );
};

export default FeedScreen;

const OngoingSchedule = styled.ScrollView<ScreenMode>`
  /* height: 152.6px; */
  border-bottom-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
  padding-vertical: 14px;
  padding-horizontal: ${SIZES.paddingHorizontal}px;
`;

const ScheduleFeed = styled.ScrollView`
  flex: 1;
  /* padding-horizontal: ${SIZES.paddingHorizontal}px; */
  padding-bottom: 30px;
`;

const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
// /////////////////

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(TextMode)`
  ${STYLED_FONTS.logoFont}
`;

const AlertText = styled(TextMode)`
  ${STYLED_FONTS.body4}
`;

//

// const noFeedScreen = (
//   <Center>
//     <Row>
//       <View>
//         <Text style={FONTS.testFont}>Brillendar</Text>

//         <Text style={FONTS.largeTitle}>Brillendar</Text>

//         <Text style={FONTS.h1}>Brillendar</Text>

//         <Text style={FONTS.h2}>Brillendar</Text>

//         <Text style={FONTS.h3}>Brillendar</Text>

//         <Text style={FONTS.h4}>Brillendar</Text>

//         <Text style={FONTS.body1}>Brillendar</Text>

//         <Text style={FONTS.body2}>Brillendar</Text>

//         <Text style={FONTS.body3}>Brillendar</Text>

//         <Text style={FONTS.body4}>Brillendar</Text>

//         <Text style={{ fontSize: SIZES.base }}>Brillendar</Text>
//       </View>

//       <View style={{ marginLeft: 12 }}>
//         <Row>
//           <Text>primary</Text>
//           <TestView bg={COLORS.primary} />
//         </Row>

//         <Row>
//           <Text>secondary</Text>
//           <TestView bg={COLORS.secondary} />
//         </Row>

//         <Row>
//           <Text>black</Text>
//           <TestView bg={COLORS.black} />
//         </Row>

//         <Row>
//           <Text>white</Text>
//           <TestView bg={COLORS.white} />
//         </Row>

//         <Row>
//           <Text>lightGray</Text>
//           <TestView bg={COLORS.lightGray} />
//         </Row>

//         <Row>
//           <Text>lightGray2</Text>
//           <TestView bg={COLORS.lightGray2} />
//         </Row>

//         <Row>
//           <Text>lightGray3</Text>
//           <TestView bg={COLORS.lightGray3} />
//         </Row>

//         <Row>
//           <Text>lightGray4</Text>
//           <TestView bg={COLORS.lightGray4} />
//         </Row>

//         <Row>
//           <Text>gray</Text>
//           <TestView bg={COLORS.gray} />
//         </Row>

//         <Row>
//           <Text>gray1</Text>
//           <TestView bg={COLORS.gray1} />
//         </Row>

//         <Row>
//           <Text>darkRed</Text>
//           <TestView bg={COLORS.darkRed} />
//         </Row>

//         <Row>
//           <Text>lightRed</Text>
//           <TestView bg={COLORS.lightRed} />
//         </Row>

//         <Row>
//           <Text>darkBlue</Text>
//           <TestView bg={COLORS.darkBlue} />
//         </Row>

//         <Row>
//           <Text>lightBlue</Text>
//           <TestView bg={COLORS.lightBlue} />
//         </Row>

//         <Row>
//           <Text>darkGreen</Text>
//           <TestView bg={COLORS.darkGreen} />
//         </Row>

//         <Row>
//           <Text>lightGreen</Text>
//           <TestView bg={COLORS.lightGreen} />
//         </Row>
//       </View>
//     </Row>
//   </Center>
// );
