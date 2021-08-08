type ScreenType = 'light' | 'dark';

type ScreenMode = {
  screenMode?: ScreenType;
};

type StorageData = {
  accessToken?: string;
  userId?: string;
};

type Relation = 0 | 1 | 2;

type ClientMember = {
  id: string;
  username: string;
  profile_img?: Maybe<string> | undefined;

  follower_count?: number;
};

type OngoingFeed = {
  id: string;
  username: string;
  profile_img: Maybe<string> | undefined;
  follower_count: number;
  title: string;
};
