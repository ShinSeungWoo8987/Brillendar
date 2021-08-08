export const chunkArray = (arr: any[], num: number): any[][] => {
  let final = [];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    temp.push(arr[i]);
    if (temp.length === num) {
      final.push(temp);
      temp = [];
    }
  }
  if (temp.length > 0) {
    final.push(temp);
  }
  return final;
};

const fillNull = (arr: any[][], num: number) => {
  let final = [...arr];

  const lastArr = arr[arr.length - 1];
  let temp = [];

  for (let i = 0; i < num - lastArr.length; i++) {
    temp.push(null);
  }

  final[final.length - 1] = [...lastArr, ...temp];

  return final;
};

export const chunkedArrayFillNull = (arr: any[], num: number): any[][] => {
  return fillNull(chunkArray(arr, num), num);
};
