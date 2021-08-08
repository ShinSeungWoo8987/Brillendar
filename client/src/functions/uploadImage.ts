// FormData;
import axios from 'axios';
import { Platform } from 'react-native';
import { serverUrl } from '../../env';

// export const uploadFiles = (uri: string[]) => {
//   const formData: FormData = new FormData();
//   const config = { headers: { 'content-type': 'multipart/form-data' } };

//   for (let i = 0; i < uri?.length; i++) {
//     formData.append('file', {
//       name: 'untitled.jpg',
//       // type: photo.type,
//       uri: Platform.OS === 'ios' ? uri[i].replace('file://', '') : uri[i],
//     });
//   }

//   return axios.post(serverUrl+`/uploadArray`, formData, config);
// };

// export const uploadFile = (file: File) => {
//   const formData = new FormData();
//   const config = { headers: { 'content-type': 'multipart/form-data' } };

//   formData.append('file', file);

//   return axios.post(serverUrl+`/uploadOne`, formData, config);
// };

// 받아온 url로 다시 graphql업로드해서 2번 통신할 필요가없음.
// formData에 내용도 같이 보내서 파일업로드+db업로드 한번에 처리
export const uploadResult = (mongo_id: string, resultDescription: string, uri: string[]) => {
  const formData: FormData = new FormData();
  const config = { headers: { 'content-type': 'multipart/form-data' } };

  formData.append('mongo_id', mongo_id);
  formData.append('result_description', resultDescription);

  if (uri.length > 0) {
    for (let i = 0; i < uri?.length; i++) {
      formData.append('file', {
        name: 'untitled.jpg',
        uri: Platform.OS === 'ios' ? uri[i].replace('file://', '') : uri[i],
      });
    }
  }

  return axios.put(serverUrl + `/schedule_result`, formData, config);
};

export const uploadProfileImg = (uri: string) => {
  const formData: FormData = new FormData();
  const config = { headers: { 'content-type': 'multipart/form-data' } };

  formData.append('file', {
    name: 'untitled.jpg',
    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
  });

  return axios.post(serverUrl + `/profile_img`, formData, config);
};
