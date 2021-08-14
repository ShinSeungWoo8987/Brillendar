import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CombinedSchedule = {
  __typename?: 'CombinedSchedule';
  id: Scalars['String'];
  writer_id: Scalars['String'];
  writer?: Member;
  tags: Array<Tag>;
  likes?: Array<Like>;
  mongo_id: Scalars['String'];
  open: Scalars['Boolean'];
  like_count: Scalars['Float'];
  start_at: Scalars['DateTime'];
  finish_at: Scalars['DateTime'];
  isLike: Scalars['Boolean'];
  title: Scalars['String'];
  description: Scalars['String'];
  comment_count: Scalars['Float'];
  result_img: Array<ScheduleImg>;
  result_description?: Maybe<Scalars['String']>;
};

export type CommentRes = {
  __typename?: 'CommentRes';
  _id: Scalars['String'];
  schedule_mongo_id: Scalars['String'];
  writer_id: Scalars['String'];
  description: Scalars['String'];
  created_at: Scalars['DateTime'];
  member: Member;
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  _id: Scalars['String'];
  schedule_mongo_id: Scalars['String'];
  writer_id: Scalars['String'];
  description: Scalars['String'];
  created_at: Scalars['DateTime'];
};

export type CommentResponseType = {
  __typename?: 'CommentResponseType';
  error?: Maybe<FieldError>;
  comment?: Maybe<CommentResponse>;
  comments?: Maybe<Array<CommentRes>>;
};

export type Feed = {
  __typename?: 'Feed';
  member: FeedMember;
  schedules: Array<CombinedSchedule>;
};

export type FeedInput = {
  day_start: Scalars['Float'];
  day_end: Scalars['Float'];
};

export type FeedMember = {
  __typename?: 'FeedMember';
  id: Scalars['String'];
  username: Scalars['String'];
  profile_img?: Maybe<Scalars['String']>;
  follower_count: Scalars['Float'];
};

export type FeedResponse = {
  __typename?: 'FeedResponse';
  error?: Maybe<FieldError>;
  feed?: Maybe<Array<Feed>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Follow = {
  __typename?: 'Follow';
  member_id: Scalars['String'];
  member: Member;
  target_id: Scalars['String'];
  target: Member;
  relation: Scalars['Float'];
};

export type Like = {
  __typename?: 'Like';
  member_id: Scalars['String'];
  member: Member;
  schedule_id: Scalars['String'];
  schedule: Schedule;
};

export type LikeResponse = {
  __typename?: 'LikeResponse';
  error?: Maybe<FieldError>;
  likes?: Maybe<Array<Like>>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['String'];
  private?: Maybe<Scalars['Boolean']>;
  email: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
  profile_img?: Maybe<Scalars['String']>;
  follower_count: Scalars['Float'];
  schedules: Array<Schedule>;
  followings: Array<Follow>;
  followers: Array<Follow>;
};

export type MemberResponse = {
  __typename?: 'MemberResponse';
  error?: Maybe<FieldError>;
  member?: Maybe<Member>;
  accessToken?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: MemberResponse;
  changePrivateAccount: Scalars['Boolean'];
  updateProfileImg: Scalars['Boolean'];
  leaveMember: Scalars['Boolean'];
  createSchedule: ScheduleResponse;
  deleteScheduleResult: Scalars['Boolean'];
  deleteSchedule: Scalars['Boolean'];
  requestFollow: Scalars['Float'];
  requestUnFollow: Scalars['Boolean'];
  acceptFollow: Scalars['Boolean'];
  rejectFollow: Scalars['Boolean'];
  likeSchedule: Scalars['Boolean'];
  unLikeSchedule: Scalars['Boolean'];
  createComment: CommentResponseType;
  emailValidation: RegisterResponse;
  verifyEmail: RegisterResponse;
  phoneValidation: RegisterResponse;
  verifyPhone: RegisterResponse;
  createMember: RegisterResponse;
};

export type MutationLoginArgs = {
  login: LoginInput;
};

export type MutationChangePrivateAccountArgs = {
  isPrivateAccount: Scalars['Boolean'];
};

export type MutationUpdateProfileImgArgs = {
  url: Scalars['String'];
};

export type MutationLeaveMemberArgs = {
  password: Scalars['String'];
};

export type MutationCreateScheduleArgs = {
  tags: Array<Scalars['String']>;
  schedule: ScheduleInput;
};

export type MutationDeleteScheduleResultArgs = {
  mongo_id: Scalars['String'];
};

export type MutationDeleteScheduleArgs = {
  mongo_id: Scalars['String'];
};

export type MutationRequestFollowArgs = {
  id: Scalars['String'];
};

export type MutationRequestUnFollowArgs = {
  id: Scalars['String'];
};

export type MutationAcceptFollowArgs = {
  id: Scalars['String'];
};

export type MutationRejectFollowArgs = {
  id: Scalars['String'];
};

export type MutationLikeScheduleArgs = {
  schedule_id: Scalars['String'];
};

export type MutationUnLikeScheduleArgs = {
  schedule_id: Scalars['String'];
};

export type MutationCreateCommentArgs = {
  description: Scalars['String'];
  mongo_id: Scalars['String'];
};

export type MutationEmailValidationArgs = {
  email: Scalars['String'];
};

export type MutationVerifyEmailArgs = {
  email: Scalars['String'];
};

export type MutationPhoneValidationArgs = {
  phone: Scalars['String'];
};

export type MutationVerifyPhoneArgs = {
  code: Scalars['String'];
  phone: Scalars['String'];
};

export type MutationCreateMemberArgs = {
  register: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  getUserDataAndFollow: MemberResponse;
  searchMember: Array<Member>;
  getScheduleScreenData: MemberResponse;
  getFollowerCount: Scalars['Float'];
  readMonthSchedule: ScheduleResponse;
  readFeedSchedule: FeedResponse;
  getLikeMembers: LikeResponse;
  getLikeSchedules: Scalars['String'];
  readComment: CommentResponseType;
  availableUsername: RegisterResponse;
};

export type QuerySearchMemberArgs = {
  search: Scalars['String'];
};

export type QueryGetScheduleScreenDataArgs = {
  id: Scalars['String'];
};

export type QueryGetFollowerCountArgs = {
  id: Scalars['String'];
};

export type QueryReadMonthScheduleArgs = {
  scheduleRequest: ScheduleRequest;
};

export type QueryReadFeedScheduleArgs = {
  feedInput: FeedInput;
};

export type QueryGetLikeMembersArgs = {
  schedule_id: Scalars['String'];
};

export type QueryReadCommentArgs = {
  mongo_id: Scalars['String'];
};

export type QueryAvailableUsernameArgs = {
  username: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
  code: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  ok?: Maybe<Scalars['Boolean']>;
  error?: Maybe<FieldError>;
};

export type Schedule = {
  __typename?: 'Schedule';
  id: Scalars['String'];
  writer_id: Scalars['String'];
  writer: Member;
  tags: Array<Tag>;
  likes: Array<Like>;
  mongo_id: Scalars['String'];
  open: Scalars['Boolean'];
  like_count: Scalars['Float'];
  start_at: Scalars['DateTime'];
  finish_at: Scalars['DateTime'];
};

export type ScheduleImg = {
  __typename?: 'ScheduleImg';
  idx: Scalars['Float'];
  url: Scalars['String'];
};

export type ScheduleInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  start_at: Scalars['Float'];
  finish_at: Scalars['Float'];
  open: Scalars['Boolean'];
};

export type ScheduleRequest = {
  id: Scalars['String'];
  month_start: Scalars['Float'];
  month_end: Scalars['Float'];
};

export type ScheduleResponse = {
  __typename?: 'ScheduleResponse';
  error?: Maybe<FieldError>;
  Schedule?: Maybe<Schedule>;
  Schedules?: Maybe<Array<CombinedSchedule>>;
  readable?: Maybe<Scalars['Boolean']>;
  following?: Maybe<Scalars['Boolean']>;
};

export type Tag = {
  __typename?: 'Tag';
  schedule_id?: Scalars['String'];
  schedule?: Schedule;
  tag: Scalars['String'];
  idx: Scalars['Float'];
};

export type AcceptFollowMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type AcceptFollowMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'acceptFollow'>;

export type ChangePrivateAccountMutationVariables = Exact<{
  isPrivateAccount: Scalars['Boolean'];
}>;

export type ChangePrivateAccountMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'changePrivateAccount'>;

export type CreateCommentMutationVariables = Exact<{
  mongo_id: Scalars['String'];
  description: Scalars['String'];
}>;

export type CreateCommentMutation = { __typename?: 'Mutation' } & {
  createComment: { __typename?: 'CommentResponseType' } & {
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    comment?: Maybe<
      { __typename?: 'CommentResponse' } & Pick<
        CommentResponse,
        '_id' | 'schedule_mongo_id' | 'writer_id' | 'description' | 'created_at'
      >
    >;
  };
};

export type CreateScheduleMutationVariables = Exact<{
  schedule: ScheduleInput;
  tags: Array<Scalars['String']> | Scalars['String'];
}>;

export type CreateScheduleMutation = { __typename?: 'Mutation' } & {
  createSchedule: { __typename?: 'ScheduleResponse' } & {
    Schedule?: Maybe<
      { __typename?: 'Schedule' } & Pick<Schedule, 'id' | 'writer_id' | 'mongo_id' | 'open' | 'start_at' | 'finish_at'>
    >;
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
  };
};

export type DeleteScheduleMutationVariables = Exact<{
  mongo_id: Scalars['String'];
}>;

export type DeleteScheduleMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'deleteSchedule'>;

export type DeleteScheduleResultMutationVariables = Exact<{
  mongo_id: Scalars['String'];
}>;

export type DeleteScheduleResultMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'deleteScheduleResult'>;

export type EmailValidationMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type EmailValidationMutation = { __typename?: 'Mutation' } & {
  emailValidation: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type LeaveMemberMutationVariables = Exact<{
  password: Scalars['String'];
}>;

export type LeaveMemberMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'leaveMember'>;

export type LikeScheduleMutationVariables = Exact<{
  schedule_id: Scalars['String'];
}>;

export type LikeScheduleMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'likeSchedule'>;

export type LoginMutationVariables = Exact<{
  login: LoginInput;
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'MemberResponse' } & Pick<MemberResponse, 'accessToken'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type PhoneValidationMutationVariables = Exact<{
  phone: Scalars['String'];
}>;

export type PhoneValidationMutation = { __typename?: 'Mutation' } & {
  phoneValidation: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type CreateMemberMutationVariables = Exact<{
  register: RegisterInput;
}>;

export type CreateMemberMutation = { __typename?: 'Mutation' } & {
  createMember: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type RejectFollowMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type RejectFollowMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'rejectFollow'>;

export type RequestFollowMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type RequestFollowMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'requestFollow'>;

export type RequestUnFollowMutationVariables = Exact<{
  id: Scalars['String'];
}>;

export type RequestUnFollowMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'requestUnFollow'>;

export type UnLikeScheduleMutationVariables = Exact<{
  schedule_id: Scalars['String'];
}>;

export type UnLikeScheduleMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'unLikeSchedule'>;

export type UpdateProfileImgMutationVariables = Exact<{
  url: Scalars['String'];
}>;

export type UpdateProfileImgMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'updateProfileImg'>;

export type VerifyEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type VerifyEmailMutation = { __typename?: 'Mutation' } & {
  verifyEmail: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type VerifyPhoneMutationVariables = Exact<{
  phone: Scalars['String'];
  code: Scalars['String'];
}>;

export type VerifyPhoneMutation = { __typename?: 'Mutation' } & {
  verifyPhone: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type AvailableUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;

export type AvailableUsernameQuery = { __typename?: 'Query' } & {
  availableUsername: { __typename?: 'RegisterResponse' } & Pick<RegisterResponse, 'ok'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    };
};

export type GetFollowerCountQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetFollowerCountQuery = { __typename?: 'Query' } & Pick<Query, 'getFollowerCount'>;

export type GetLikeMembersQueryVariables = Exact<{
  schedule_id: Scalars['String'];
}>;

export type GetLikeMembersQuery = { __typename?: 'Query' } & {
  getLikeMembers: { __typename?: 'LikeResponse' } & {
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    likes?: Maybe<
      Array<
        { __typename?: 'Like' } & {
          member: { __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'follower_count'>;
        }
      >
    >;
  };
};

export type GetUserDataAndFollowQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserDataAndFollowQuery = { __typename?: 'Query' } & {
  getUserDataAndFollow: { __typename?: 'MemberResponse' } & {
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    member?: Maybe<
      { __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'private'> & {
          followings: Array<
            { __typename?: 'Follow' } & Pick<Follow, 'relation'> & {
                target: { __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'follower_count'>;
              }
          >;
          followers: Array<
            { __typename?: 'Follow' } & Pick<Follow, 'relation'> & {
                member: { __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'follower_count'>;
              }
          >;
        }
    >;
  };
};

export type HelloQueryVariables = Exact<{ [key: string]: never }>;

export type HelloQuery = { __typename?: 'Query' } & Pick<Query, 'hello'>;

export type ReadCommentQueryVariables = Exact<{
  mongo_id: Scalars['String'];
}>;

export type ReadCommentQuery = { __typename?: 'Query' } & {
  readComment: { __typename?: 'CommentResponseType' } & {
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    comments?: Maybe<
      Array<
        { __typename?: 'CommentRes' } & Pick<
          CommentRes,
          '_id' | 'schedule_mongo_id' | 'writer_id' | 'description' | 'created_at'
        > & { member: { __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'follower_count'> }
      >
    >;
  };
};

export type ReadFeedScheduleQueryVariables = Exact<{
  feedInput: FeedInput;
}>;

export type ReadFeedScheduleQuery = { __typename?: 'Query' } & {
  readFeedSchedule: { __typename?: 'FeedResponse' } & {
    error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
    feed?: Maybe<
      Array<
        { __typename?: 'Feed' } & {
          member: { __typename?: 'FeedMember' } & Pick<
            FeedMember,
            'id' | 'username' | 'profile_img' | 'follower_count'
          >;
          schedules: Array<
            { __typename?: 'CombinedSchedule' } & Pick<
              CombinedSchedule,
              | 'id'
              | 'title'
              | 'description'
              | 'comment_count'
              | 'writer_id'
              | 'mongo_id'
              | 'open'
              | 'start_at'
              | 'finish_at'
              | 'like_count'
              | 'isLike'
              | 'result_description'
            > & {
                tags: Array<{ __typename?: 'Tag' } & Pick<Tag, 'idx' | 'tag'>>;
                result_img: Array<{ __typename?: 'ScheduleImg' } & Pick<ScheduleImg, 'idx' | 'url'>>;
              }
          >;
        }
      >
    >;
  };
};

export type ReadMonthScheduleQueryVariables = Exact<{
  scheduleRequest: ScheduleRequest;
}>;

export type ReadMonthScheduleQuery = { __typename?: 'Query' } & {
  readMonthSchedule: { __typename?: 'ScheduleResponse' } & Pick<ScheduleResponse, 'readable' | 'following'> & {
      error?: Maybe<{ __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>>;
      Schedules?: Maybe<
        Array<
          { __typename?: 'CombinedSchedule' } & Pick<
            CombinedSchedule,
            | 'id'
            | 'title'
            | 'description'
            | 'comment_count'
            | 'writer_id'
            | 'mongo_id'
            | 'open'
            | 'start_at'
            | 'finish_at'
            | 'like_count'
            | 'isLike'
            | 'result_description'
          > & {
              tags: Array<{ __typename?: 'Tag' } & Pick<Tag, 'idx' | 'tag'>>;
              result_img: Array<{ __typename?: 'ScheduleImg' } & Pick<ScheduleImg, 'idx' | 'url'>>;
            }
        >
      >;
    };
};

export type SearchMemberQueryVariables = Exact<{
  search: Scalars['String'];
}>;

export type SearchMemberQuery = { __typename?: 'Query' } & {
  searchMember: Array<{ __typename?: 'Member' } & Pick<Member, 'id' | 'username' | 'profile_img' | 'follower_count'>>;
};

export const AcceptFollowDocument = gql`
  mutation AcceptFollow($id: String!) {
    acceptFollow(id: $id)
  }
`;
export type AcceptFollowMutationFn = Apollo.MutationFunction<AcceptFollowMutation, AcceptFollowMutationVariables>;

/**
 * __useAcceptFollowMutation__
 *
 * To run a mutation, you first call `useAcceptFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptFollowMutation, { data, loading, error }] = useAcceptFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<AcceptFollowMutation, AcceptFollowMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AcceptFollowMutation, AcceptFollowMutationVariables>(AcceptFollowDocument, options);
}
export type AcceptFollowMutationHookResult = ReturnType<typeof useAcceptFollowMutation>;
export type AcceptFollowMutationResult = Apollo.MutationResult<AcceptFollowMutation>;
export type AcceptFollowMutationOptions = Apollo.BaseMutationOptions<
  AcceptFollowMutation,
  AcceptFollowMutationVariables
>;
export const ChangePrivateAccountDocument = gql`
  mutation ChangePrivateAccount($isPrivateAccount: Boolean!) {
    changePrivateAccount(isPrivateAccount: $isPrivateAccount)
  }
`;
export type ChangePrivateAccountMutationFn = Apollo.MutationFunction<
  ChangePrivateAccountMutation,
  ChangePrivateAccountMutationVariables
>;

/**
 * __useChangePrivateAccountMutation__
 *
 * To run a mutation, you first call `useChangePrivateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePrivateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePrivateAccountMutation, { data, loading, error }] = useChangePrivateAccountMutation({
 *   variables: {
 *      isPrivateAccount: // value for 'isPrivateAccount'
 *   },
 * });
 */
export function useChangePrivateAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangePrivateAccountMutation, ChangePrivateAccountMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ChangePrivateAccountMutation, ChangePrivateAccountMutationVariables>(
    ChangePrivateAccountDocument,
    options
  );
}
export type ChangePrivateAccountMutationHookResult = ReturnType<typeof useChangePrivateAccountMutation>;
export type ChangePrivateAccountMutationResult = Apollo.MutationResult<ChangePrivateAccountMutation>;
export type ChangePrivateAccountMutationOptions = Apollo.BaseMutationOptions<
  ChangePrivateAccountMutation,
  ChangePrivateAccountMutationVariables
>;
export const CreateCommentDocument = gql`
  mutation CreateComment($mongo_id: String!, $description: String!) {
    createComment(mongo_id: $mongo_id, description: $description) {
      error {
        field
        message
      }
      comment {
        _id
        schedule_mongo_id
        writer_id
        description
        created_at
      }
    }
  }
`;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      mongo_id: // value for 'mongo_id'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
}
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
  CreateCommentMutation,
  CreateCommentMutationVariables
>;
export const CreateScheduleDocument = gql`
  mutation CreateSchedule($schedule: ScheduleInput!, $tags: [String!]!) {
    createSchedule(schedule: $schedule, tags: $tags) {
      Schedule {
        id
        writer_id
        mongo_id
        open
        start_at
        finish_at
      }
      error {
        field
        message
      }
    }
  }
`;
export type CreateScheduleMutationFn = Apollo.MutationFunction<CreateScheduleMutation, CreateScheduleMutationVariables>;

/**
 * __useCreateScheduleMutation__
 *
 * To run a mutation, you first call `useCreateScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScheduleMutation, { data, loading, error }] = useCreateScheduleMutation({
 *   variables: {
 *      schedule: // value for 'schedule'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useCreateScheduleMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateScheduleMutation, CreateScheduleMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateScheduleMutation, CreateScheduleMutationVariables>(CreateScheduleDocument, options);
}
export type CreateScheduleMutationHookResult = ReturnType<typeof useCreateScheduleMutation>;
export type CreateScheduleMutationResult = Apollo.MutationResult<CreateScheduleMutation>;
export type CreateScheduleMutationOptions = Apollo.BaseMutationOptions<
  CreateScheduleMutation,
  CreateScheduleMutationVariables
>;
export const DeleteScheduleDocument = gql`
  mutation DeleteSchedule($mongo_id: String!) {
    deleteSchedule(mongo_id: $mongo_id)
  }
`;
export type DeleteScheduleMutationFn = Apollo.MutationFunction<DeleteScheduleMutation, DeleteScheduleMutationVariables>;

/**
 * __useDeleteScheduleMutation__
 *
 * To run a mutation, you first call `useDeleteScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScheduleMutation, { data, loading, error }] = useDeleteScheduleMutation({
 *   variables: {
 *      mongo_id: // value for 'mongo_id'
 *   },
 * });
 */
export function useDeleteScheduleMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteScheduleMutation, DeleteScheduleMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteScheduleMutation, DeleteScheduleMutationVariables>(DeleteScheduleDocument, options);
}
export type DeleteScheduleMutationHookResult = ReturnType<typeof useDeleteScheduleMutation>;
export type DeleteScheduleMutationResult = Apollo.MutationResult<DeleteScheduleMutation>;
export type DeleteScheduleMutationOptions = Apollo.BaseMutationOptions<
  DeleteScheduleMutation,
  DeleteScheduleMutationVariables
>;
export const DeleteScheduleResultDocument = gql`
  mutation DeleteScheduleResult($mongo_id: String!) {
    deleteScheduleResult(mongo_id: $mongo_id)
  }
`;
export type DeleteScheduleResultMutationFn = Apollo.MutationFunction<
  DeleteScheduleResultMutation,
  DeleteScheduleResultMutationVariables
>;

/**
 * __useDeleteScheduleResultMutation__
 *
 * To run a mutation, you first call `useDeleteScheduleResultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScheduleResultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScheduleResultMutation, { data, loading, error }] = useDeleteScheduleResultMutation({
 *   variables: {
 *      mongo_id: // value for 'mongo_id'
 *   },
 * });
 */
export function useDeleteScheduleResultMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteScheduleResultMutation, DeleteScheduleResultMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteScheduleResultMutation, DeleteScheduleResultMutationVariables>(
    DeleteScheduleResultDocument,
    options
  );
}
export type DeleteScheduleResultMutationHookResult = ReturnType<typeof useDeleteScheduleResultMutation>;
export type DeleteScheduleResultMutationResult = Apollo.MutationResult<DeleteScheduleResultMutation>;
export type DeleteScheduleResultMutationOptions = Apollo.BaseMutationOptions<
  DeleteScheduleResultMutation,
  DeleteScheduleResultMutationVariables
>;
export const EmailValidationDocument = gql`
  mutation EmailValidation($email: String!) {
    emailValidation(email: $email) {
      ok
      error {
        field
        message
      }
    }
  }
`;
export type EmailValidationMutationFn = Apollo.MutationFunction<
  EmailValidationMutation,
  EmailValidationMutationVariables
>;

/**
 * __useEmailValidationMutation__
 *
 * To run a mutation, you first call `useEmailValidationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailValidationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailValidationMutation, { data, loading, error }] = useEmailValidationMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useEmailValidationMutation(
  baseOptions?: Apollo.MutationHookOptions<EmailValidationMutation, EmailValidationMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EmailValidationMutation, EmailValidationMutationVariables>(
    EmailValidationDocument,
    options
  );
}
export type EmailValidationMutationHookResult = ReturnType<typeof useEmailValidationMutation>;
export type EmailValidationMutationResult = Apollo.MutationResult<EmailValidationMutation>;
export type EmailValidationMutationOptions = Apollo.BaseMutationOptions<
  EmailValidationMutation,
  EmailValidationMutationVariables
>;
export const LeaveMemberDocument = gql`
  mutation LeaveMember($password: String!) {
    leaveMember(password: $password)
  }
`;
export type LeaveMemberMutationFn = Apollo.MutationFunction<LeaveMemberMutation, LeaveMemberMutationVariables>;

/**
 * __useLeaveMemberMutation__
 *
 * To run a mutation, you first call `useLeaveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveMemberMutation, { data, loading, error }] = useLeaveMemberMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLeaveMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<LeaveMemberMutation, LeaveMemberMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LeaveMemberMutation, LeaveMemberMutationVariables>(LeaveMemberDocument, options);
}
export type LeaveMemberMutationHookResult = ReturnType<typeof useLeaveMemberMutation>;
export type LeaveMemberMutationResult = Apollo.MutationResult<LeaveMemberMutation>;
export type LeaveMemberMutationOptions = Apollo.BaseMutationOptions<LeaveMemberMutation, LeaveMemberMutationVariables>;
export const LikeScheduleDocument = gql`
  mutation LikeSchedule($schedule_id: String!) {
    likeSchedule(schedule_id: $schedule_id)
  }
`;
export type LikeScheduleMutationFn = Apollo.MutationFunction<LikeScheduleMutation, LikeScheduleMutationVariables>;

/**
 * __useLikeScheduleMutation__
 *
 * To run a mutation, you first call `useLikeScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeScheduleMutation, { data, loading, error }] = useLikeScheduleMutation({
 *   variables: {
 *      schedule_id: // value for 'schedule_id'
 *   },
 * });
 */
export function useLikeScheduleMutation(
  baseOptions?: Apollo.MutationHookOptions<LikeScheduleMutation, LikeScheduleMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LikeScheduleMutation, LikeScheduleMutationVariables>(LikeScheduleDocument, options);
}
export type LikeScheduleMutationHookResult = ReturnType<typeof useLikeScheduleMutation>;
export type LikeScheduleMutationResult = Apollo.MutationResult<LikeScheduleMutation>;
export type LikeScheduleMutationOptions = Apollo.BaseMutationOptions<
  LikeScheduleMutation,
  LikeScheduleMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($login: LoginInput!) {
    login(login: $login) {
      error {
        field
        message
      }
      accessToken
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      login: // value for 'login'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const PhoneValidationDocument = gql`
  mutation PhoneValidation($phone: String!) {
    phoneValidation(phone: $phone) {
      ok
      error {
        field
        message
      }
    }
  }
`;
export type PhoneValidationMutationFn = Apollo.MutationFunction<
  PhoneValidationMutation,
  PhoneValidationMutationVariables
>;

/**
 * __usePhoneValidationMutation__
 *
 * To run a mutation, you first call `usePhoneValidationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePhoneValidationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [phoneValidationMutation, { data, loading, error }] = usePhoneValidationMutation({
 *   variables: {
 *      phone: // value for 'phone'
 *   },
 * });
 */
export function usePhoneValidationMutation(
  baseOptions?: Apollo.MutationHookOptions<PhoneValidationMutation, PhoneValidationMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PhoneValidationMutation, PhoneValidationMutationVariables>(
    PhoneValidationDocument,
    options
  );
}
export type PhoneValidationMutationHookResult = ReturnType<typeof usePhoneValidationMutation>;
export type PhoneValidationMutationResult = Apollo.MutationResult<PhoneValidationMutation>;
export type PhoneValidationMutationOptions = Apollo.BaseMutationOptions<
  PhoneValidationMutation,
  PhoneValidationMutationVariables
>;
export const CreateMemberDocument = gql`
  mutation createMember($register: RegisterInput!) {
    createMember(register: $register) {
      ok
      error {
        field
        message
      }
    }
  }
`;
export type CreateMemberMutationFn = Apollo.MutationFunction<CreateMemberMutation, CreateMemberMutationVariables>;

/**
 * __useCreateMemberMutation__
 *
 * To run a mutation, you first call `useCreateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMemberMutation, { data, loading, error }] = useCreateMemberMutation({
 *   variables: {
 *      register: // value for 'register'
 *   },
 * });
 */
export function useCreateMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateMemberMutation, CreateMemberMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateMemberMutation, CreateMemberMutationVariables>(CreateMemberDocument, options);
}
export type CreateMemberMutationHookResult = ReturnType<typeof useCreateMemberMutation>;
export type CreateMemberMutationResult = Apollo.MutationResult<CreateMemberMutation>;
export type CreateMemberMutationOptions = Apollo.BaseMutationOptions<
  CreateMemberMutation,
  CreateMemberMutationVariables
>;
export const RejectFollowDocument = gql`
  mutation RejectFollow($id: String!) {
    rejectFollow(id: $id)
  }
`;
export type RejectFollowMutationFn = Apollo.MutationFunction<RejectFollowMutation, RejectFollowMutationVariables>;

/**
 * __useRejectFollowMutation__
 *
 * To run a mutation, you first call `useRejectFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectFollowMutation, { data, loading, error }] = useRejectFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<RejectFollowMutation, RejectFollowMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RejectFollowMutation, RejectFollowMutationVariables>(RejectFollowDocument, options);
}
export type RejectFollowMutationHookResult = ReturnType<typeof useRejectFollowMutation>;
export type RejectFollowMutationResult = Apollo.MutationResult<RejectFollowMutation>;
export type RejectFollowMutationOptions = Apollo.BaseMutationOptions<
  RejectFollowMutation,
  RejectFollowMutationVariables
>;
export const RequestFollowDocument = gql`
  mutation RequestFollow($id: String!) {
    requestFollow(id: $id)
  }
`;
export type RequestFollowMutationFn = Apollo.MutationFunction<RequestFollowMutation, RequestFollowMutationVariables>;

/**
 * __useRequestFollowMutation__
 *
 * To run a mutation, you first call `useRequestFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFollowMutation, { data, loading, error }] = useRequestFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRequestFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<RequestFollowMutation, RequestFollowMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RequestFollowMutation, RequestFollowMutationVariables>(RequestFollowDocument, options);
}
export type RequestFollowMutationHookResult = ReturnType<typeof useRequestFollowMutation>;
export type RequestFollowMutationResult = Apollo.MutationResult<RequestFollowMutation>;
export type RequestFollowMutationOptions = Apollo.BaseMutationOptions<
  RequestFollowMutation,
  RequestFollowMutationVariables
>;
export const RequestUnFollowDocument = gql`
  mutation RequestUnFollow($id: String!) {
    requestUnFollow(id: $id)
  }
`;
export type RequestUnFollowMutationFn = Apollo.MutationFunction<
  RequestUnFollowMutation,
  RequestUnFollowMutationVariables
>;

/**
 * __useRequestUnFollowMutation__
 *
 * To run a mutation, you first call `useRequestUnFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestUnFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestUnFollowMutation, { data, loading, error }] = useRequestUnFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRequestUnFollowMutation(
  baseOptions?: Apollo.MutationHookOptions<RequestUnFollowMutation, RequestUnFollowMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RequestUnFollowMutation, RequestUnFollowMutationVariables>(
    RequestUnFollowDocument,
    options
  );
}
export type RequestUnFollowMutationHookResult = ReturnType<typeof useRequestUnFollowMutation>;
export type RequestUnFollowMutationResult = Apollo.MutationResult<RequestUnFollowMutation>;
export type RequestUnFollowMutationOptions = Apollo.BaseMutationOptions<
  RequestUnFollowMutation,
  RequestUnFollowMutationVariables
>;
export const UnLikeScheduleDocument = gql`
  mutation UnLikeSchedule($schedule_id: String!) {
    unLikeSchedule(schedule_id: $schedule_id)
  }
`;
export type UnLikeScheduleMutationFn = Apollo.MutationFunction<UnLikeScheduleMutation, UnLikeScheduleMutationVariables>;

/**
 * __useUnLikeScheduleMutation__
 *
 * To run a mutation, you first call `useUnLikeScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnLikeScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unLikeScheduleMutation, { data, loading, error }] = useUnLikeScheduleMutation({
 *   variables: {
 *      schedule_id: // value for 'schedule_id'
 *   },
 * });
 */
export function useUnLikeScheduleMutation(
  baseOptions?: Apollo.MutationHookOptions<UnLikeScheduleMutation, UnLikeScheduleMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnLikeScheduleMutation, UnLikeScheduleMutationVariables>(UnLikeScheduleDocument, options);
}
export type UnLikeScheduleMutationHookResult = ReturnType<typeof useUnLikeScheduleMutation>;
export type UnLikeScheduleMutationResult = Apollo.MutationResult<UnLikeScheduleMutation>;
export type UnLikeScheduleMutationOptions = Apollo.BaseMutationOptions<
  UnLikeScheduleMutation,
  UnLikeScheduleMutationVariables
>;
export const UpdateProfileImgDocument = gql`
  mutation UpdateProfileImg($url: String!) {
    updateProfileImg(url: $url)
  }
`;
export type UpdateProfileImgMutationFn = Apollo.MutationFunction<
  UpdateProfileImgMutation,
  UpdateProfileImgMutationVariables
>;

/**
 * __useUpdateProfileImgMutation__
 *
 * To run a mutation, you first call `useUpdateProfileImgMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileImgMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileImgMutation, { data, loading, error }] = useUpdateProfileImgMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useUpdateProfileImgMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateProfileImgMutation, UpdateProfileImgMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProfileImgMutation, UpdateProfileImgMutationVariables>(
    UpdateProfileImgDocument,
    options
  );
}
export type UpdateProfileImgMutationHookResult = ReturnType<typeof useUpdateProfileImgMutation>;
export type UpdateProfileImgMutationResult = Apollo.MutationResult<UpdateProfileImgMutation>;
export type UpdateProfileImgMutationOptions = Apollo.BaseMutationOptions<
  UpdateProfileImgMutation,
  UpdateProfileImgMutationVariables
>;
export const VerifyEmailDocument = gql`
  mutation VerifyEmail($email: String!) {
    verifyEmail(email: $email) {
      ok
      error {
        field
        message
      }
    }
  }
`;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useVerifyEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
}
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const VerifyPhoneDocument = gql`
  mutation VerifyPhone($phone: String!, $code: String!) {
    verifyPhone(phone: $phone, code: $code) {
      ok
      error {
        field
        message
      }
    }
  }
`;
export type VerifyPhoneMutationFn = Apollo.MutationFunction<VerifyPhoneMutation, VerifyPhoneMutationVariables>;

/**
 * __useVerifyPhoneMutation__
 *
 * To run a mutation, you first call `useVerifyPhoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyPhoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyPhoneMutation, { data, loading, error }] = useVerifyPhoneMutation({
 *   variables: {
 *      phone: // value for 'phone'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyPhoneMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifyPhoneMutation, VerifyPhoneMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VerifyPhoneMutation, VerifyPhoneMutationVariables>(VerifyPhoneDocument, options);
}
export type VerifyPhoneMutationHookResult = ReturnType<typeof useVerifyPhoneMutation>;
export type VerifyPhoneMutationResult = Apollo.MutationResult<VerifyPhoneMutation>;
export type VerifyPhoneMutationOptions = Apollo.BaseMutationOptions<VerifyPhoneMutation, VerifyPhoneMutationVariables>;
export const AvailableUsernameDocument = gql`
  query AvailableUsername($username: String!) {
    availableUsername(username: $username) {
      ok
      error {
        field
        message
      }
    }
  }
`;

/**
 * __useAvailableUsernameQuery__
 *
 * To run a query within a React component, call `useAvailableUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useAvailableUsernameQuery(
  baseOptions: Apollo.QueryHookOptions<AvailableUsernameQuery, AvailableUsernameQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AvailableUsernameQuery, AvailableUsernameQueryVariables>(AvailableUsernameDocument, options);
}
export function useAvailableUsernameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AvailableUsernameQuery, AvailableUsernameQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AvailableUsernameQuery, AvailableUsernameQueryVariables>(
    AvailableUsernameDocument,
    options
  );
}
export type AvailableUsernameQueryHookResult = ReturnType<typeof useAvailableUsernameQuery>;
export type AvailableUsernameLazyQueryHookResult = ReturnType<typeof useAvailableUsernameLazyQuery>;
export type AvailableUsernameQueryResult = Apollo.QueryResult<AvailableUsernameQuery, AvailableUsernameQueryVariables>;
export const GetFollowerCountDocument = gql`
  query GetFollowerCount($id: String!) {
    getFollowerCount(id: $id)
  }
`;

/**
 * __useGetFollowerCountQuery__
 *
 * To run a query within a React component, call `useGetFollowerCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowerCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowerCountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFollowerCountQuery(
  baseOptions: Apollo.QueryHookOptions<GetFollowerCountQuery, GetFollowerCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFollowerCountQuery, GetFollowerCountQueryVariables>(GetFollowerCountDocument, options);
}
export function useGetFollowerCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFollowerCountQuery, GetFollowerCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFollowerCountQuery, GetFollowerCountQueryVariables>(GetFollowerCountDocument, options);
}
export type GetFollowerCountQueryHookResult = ReturnType<typeof useGetFollowerCountQuery>;
export type GetFollowerCountLazyQueryHookResult = ReturnType<typeof useGetFollowerCountLazyQuery>;
export type GetFollowerCountQueryResult = Apollo.QueryResult<GetFollowerCountQuery, GetFollowerCountQueryVariables>;
export const GetLikeMembersDocument = gql`
  query GetLikeMembers($schedule_id: String!) {
    getLikeMembers(schedule_id: $schedule_id) {
      error {
        field
        message
      }
      likes {
        member {
          id
          username
          profile_img
          follower_count
        }
      }
    }
  }
`;

/**
 * __useGetLikeMembersQuery__
 *
 * To run a query within a React component, call `useGetLikeMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLikeMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLikeMembersQuery({
 *   variables: {
 *      schedule_id: // value for 'schedule_id'
 *   },
 * });
 */
export function useGetLikeMembersQuery(
  baseOptions: Apollo.QueryHookOptions<GetLikeMembersQuery, GetLikeMembersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLikeMembersQuery, GetLikeMembersQueryVariables>(GetLikeMembersDocument, options);
}
export function useGetLikeMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetLikeMembersQuery, GetLikeMembersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLikeMembersQuery, GetLikeMembersQueryVariables>(GetLikeMembersDocument, options);
}
export type GetLikeMembersQueryHookResult = ReturnType<typeof useGetLikeMembersQuery>;
export type GetLikeMembersLazyQueryHookResult = ReturnType<typeof useGetLikeMembersLazyQuery>;
export type GetLikeMembersQueryResult = Apollo.QueryResult<GetLikeMembersQuery, GetLikeMembersQueryVariables>;
export const GetUserDataAndFollowDocument = gql`
  query GetUserDataAndFollow {
    getUserDataAndFollow {
      error {
        field
        message
      }
      member {
        id
        username
        profile_img
        private
        followings {
          relation
          target {
            id
            username
            profile_img
            follower_count
          }
        }
        followers {
          relation
          member {
            id
            username
            profile_img
            follower_count
          }
        }
      }
    }
  }
`;

/**
 * __useGetUserDataAndFollowQuery__
 *
 * To run a query within a React component, call `useGetUserDataAndFollowQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataAndFollowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataAndFollowQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserDataAndFollowQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUserDataAndFollowQuery, GetUserDataAndFollowQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserDataAndFollowQuery, GetUserDataAndFollowQueryVariables>(
    GetUserDataAndFollowDocument,
    options
  );
}
export function useGetUserDataAndFollowLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserDataAndFollowQuery, GetUserDataAndFollowQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserDataAndFollowQuery, GetUserDataAndFollowQueryVariables>(
    GetUserDataAndFollowDocument,
    options
  );
}
export type GetUserDataAndFollowQueryHookResult = ReturnType<typeof useGetUserDataAndFollowQuery>;
export type GetUserDataAndFollowLazyQueryHookResult = ReturnType<typeof useGetUserDataAndFollowLazyQuery>;
export type GetUserDataAndFollowQueryResult = Apollo.QueryResult<
  GetUserDataAndFollowQuery,
  GetUserDataAndFollowQueryVariables
>;
export const HelloDocument = gql`
  query Hello {
    hello
  }
`;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
}
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
}
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const ReadCommentDocument = gql`
  query ReadComment($mongo_id: String!) {
    readComment(mongo_id: $mongo_id) {
      error {
        field
        message
      }
      comments {
        _id
        schedule_mongo_id
        writer_id
        description
        created_at
        member {
          id
          username
          profile_img
          follower_count
        }
      }
    }
  }
`;

/**
 * __useReadCommentQuery__
 *
 * To run a query within a React component, call `useReadCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadCommentQuery({
 *   variables: {
 *      mongo_id: // value for 'mongo_id'
 *   },
 * });
 */
export function useReadCommentQuery(baseOptions: Apollo.QueryHookOptions<ReadCommentQuery, ReadCommentQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ReadCommentQuery, ReadCommentQueryVariables>(ReadCommentDocument, options);
}
export function useReadCommentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ReadCommentQuery, ReadCommentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ReadCommentQuery, ReadCommentQueryVariables>(ReadCommentDocument, options);
}
export type ReadCommentQueryHookResult = ReturnType<typeof useReadCommentQuery>;
export type ReadCommentLazyQueryHookResult = ReturnType<typeof useReadCommentLazyQuery>;
export type ReadCommentQueryResult = Apollo.QueryResult<ReadCommentQuery, ReadCommentQueryVariables>;
export const ReadFeedScheduleDocument = gql`
  query ReadFeedSchedule($feedInput: FeedInput!) {
    readFeedSchedule(feedInput: $feedInput) {
      error {
        field
        message
      }
      feed {
        member {
          id
          username
          profile_img
          follower_count
        }
        schedules {
          id
          title
          description
          comment_count
          writer_id
          tags {
            idx
            tag
          }
          mongo_id
          open
          start_at
          finish_at
          like_count
          isLike
          result_description
          result_img {
            idx
            url
          }
        }
      }
    }
  }
`;

/**
 * __useReadFeedScheduleQuery__
 *
 * To run a query within a React component, call `useReadFeedScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadFeedScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadFeedScheduleQuery({
 *   variables: {
 *      feedInput: // value for 'feedInput'
 *   },
 * });
 */
export function useReadFeedScheduleQuery(
  baseOptions: Apollo.QueryHookOptions<ReadFeedScheduleQuery, ReadFeedScheduleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ReadFeedScheduleQuery, ReadFeedScheduleQueryVariables>(ReadFeedScheduleDocument, options);
}
export function useReadFeedScheduleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ReadFeedScheduleQuery, ReadFeedScheduleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ReadFeedScheduleQuery, ReadFeedScheduleQueryVariables>(ReadFeedScheduleDocument, options);
}
export type ReadFeedScheduleQueryHookResult = ReturnType<typeof useReadFeedScheduleQuery>;
export type ReadFeedScheduleLazyQueryHookResult = ReturnType<typeof useReadFeedScheduleLazyQuery>;
export type ReadFeedScheduleQueryResult = Apollo.QueryResult<ReadFeedScheduleQuery, ReadFeedScheduleQueryVariables>;
export const ReadMonthScheduleDocument = gql`
  query ReadMonthSchedule($scheduleRequest: ScheduleRequest!) {
    readMonthSchedule(scheduleRequest: $scheduleRequest) {
      error {
        field
        message
      }
      readable
      following
      Schedules {
        id
        title
        description
        comment_count
        writer_id
        tags {
          idx
          tag
        }
        mongo_id
        open
        start_at
        finish_at
        like_count
        isLike
        result_description
        result_img {
          idx
          url
        }
      }
    }
  }
`;

/**
 * __useReadMonthScheduleQuery__
 *
 * To run a query within a React component, call `useReadMonthScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useReadMonthScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReadMonthScheduleQuery({
 *   variables: {
 *      scheduleRequest: // value for 'scheduleRequest'
 *   },
 * });
 */
export function useReadMonthScheduleQuery(
  baseOptions: Apollo.QueryHookOptions<ReadMonthScheduleQuery, ReadMonthScheduleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ReadMonthScheduleQuery, ReadMonthScheduleQueryVariables>(ReadMonthScheduleDocument, options);
}
export function useReadMonthScheduleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ReadMonthScheduleQuery, ReadMonthScheduleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ReadMonthScheduleQuery, ReadMonthScheduleQueryVariables>(
    ReadMonthScheduleDocument,
    options
  );
}
export type ReadMonthScheduleQueryHookResult = ReturnType<typeof useReadMonthScheduleQuery>;
export type ReadMonthScheduleLazyQueryHookResult = ReturnType<typeof useReadMonthScheduleLazyQuery>;
export type ReadMonthScheduleQueryResult = Apollo.QueryResult<ReadMonthScheduleQuery, ReadMonthScheduleQueryVariables>;
export const SearchMemberDocument = gql`
  query SearchMember($search: String!) {
    searchMember(search: $search) {
      id
      username
      profile_img
      follower_count
    }
  }
`;

/**
 * __useSearchMemberQuery__
 *
 * To run a query within a React component, call `useSearchMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMemberQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchMemberQuery(
  baseOptions: Apollo.QueryHookOptions<SearchMemberQuery, SearchMemberQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchMemberQuery, SearchMemberQueryVariables>(SearchMemberDocument, options);
}
export function useSearchMemberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchMemberQuery, SearchMemberQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchMemberQuery, SearchMemberQueryVariables>(SearchMemberDocument, options);
}
export type SearchMemberQueryHookResult = ReturnType<typeof useSearchMemberQuery>;
export type SearchMemberLazyQueryHookResult = ReturnType<typeof useSearchMemberLazyQuery>;
export type SearchMemberQueryResult = Apollo.QueryResult<SearchMemberQuery, SearchMemberQueryVariables>;
